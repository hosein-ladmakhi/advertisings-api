import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
    this.onlineUsers = this.onlineUsers.filter((e) => e !== this.user.id);
    this.server.emit('user-status', { users: this.onlineUsers });
  }
  user: any;

  onlineUsers: string[] = [];

  @Inject(SupabaseService) private readonly supabaseService: SupabaseService;

  @Inject(WsGuardService) wsGuardService: WsGuardService;

  async handleConnection(client: Socket, ...args: any[]) {
    this.user = await this.wsGuardService.verify(client.handshake.auth?.token);
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
        ...(body?.reply ? { reply: body?.reply } : {}),
      })
      ?.select('*, sender(*), receiver(*), reply(*)')
      ?.single()
      ?.then((response) => {
        return response.data;
      });

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

  @SubscribeMessage('read-messages')
  async readMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: any,
  ) {
    for (let index = 0; index < body.messages.length; index++) {
      const element = body.messages[index];
      console.log(element);
      await this.supabaseService
        .getClient()
        .from('chats')
        .update({ seen: true })
        .eq('id', element)
        ?.select()
        ?.single();
    }

    client.broadcast.emit('notift-read-messages', { messages: body.messages });
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

  @SubscribeMessage('become-online')
  async handleOnlineStatus() {
    this.onlineUsers.push(this.user?.id);
    this.server.emit('user-status', { users: this.onlineUsers });
  }
}
