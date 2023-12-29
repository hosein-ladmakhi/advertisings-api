import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChatsService } from './chats.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@supabase/supabase-js';

@UseGuards(JwtGuard)
@Controller('chats')
export class ChatsController {
  @Inject(ChatsService) private readonly chatsService: ChatsService;

  @Get('/receiver/:receiverId')
  getChats(@CurrentUser() user: User, @Param('receiverId') receiverId: string) {
    return this.chatsService.getChats(user?.id, receiverId);
  }
}
