import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsGuardService } from 'src/common/services/ws-guard.service';
import { SupabaseService } from 'src/common/supabase/supabase.service';

@WebSocketGateway()
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  handleDisconnect(client: Socket) {
    this.server.emit('user-status', { online: false, user: this.user });
  }
  user: any;

  @Inject(SupabaseService) private readonly supabaseService: SupabaseService;

  @Inject(WsGuardService) wsGuardService: WsGuardService;

  async handleConnection(client: Socket, ...args: any[]) {
    this.user = await this.wsGuardService.verify(client.handshake.auth?.token);
    this.server.emit('user-status', {
      online: true,
      user: this.user,
    });
    console.log('salam');
  }

  @SubscribeMessage('send-message')
  async sendMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.supabaseService
      .getClient()
      .from('chats')
      .insert({
        receiver: body.receiver,
        sender: this.user.id,
        content: body.content,
        reply: body?.reply,
      })
      ?.select('*, sender(*), receiver(*), reply(*)')
      ?.single()
      ?.then(({ data }) => data);

    client.broadcast.emit('send-message-notify', message);
  }

  @SubscribeMessage('start-typing')
  async userTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any,
  ) {
    client.broadcast.emit('typing', {
      user: this.user,
      status: true,
      with: body.with,
    });
  }

  @SubscribeMessage('stop-typing')
  async userStopTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any,
  ) {
    client.broadcast.emit('typing', {
      user: this.user,
      status: false,
      with: body.with,
    });
  }
}
