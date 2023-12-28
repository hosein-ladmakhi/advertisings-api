import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { JwtModule } from '@nestjs/jwt';
import { WsGuardService } from 'src/common/services/ws-guard.service';
import { SupabaseModule } from 'src/common/supabase/supabase.module';

@Module({
  providers: [ChatsGateway, WsGuardService],
  imports: [
    JwtModule.register({ signOptions: { expiresIn: '1h' }, secret: 'xxx' }),
    SupabaseModule,
  ],
})
export class ChatsModule {}
