import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { JwtModule } from '@nestjs/jwt';
import { WsGuardService } from 'src/common/services/ws-guard.service';
import { SupabaseModule } from 'src/common/supabase/supabase.module';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';

@Module({
  providers: [ChatsGateway, WsGuardService, ChatsService],
  imports: [
    JwtModule.register({ signOptions: { expiresIn: '1h' }, secret: 'xxx' }),
    SupabaseModule,
  ],
  controllers: [ChatsController],
})
export class ChatsModule {}
