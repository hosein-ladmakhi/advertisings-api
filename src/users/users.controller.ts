import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@supabase/supabase-js';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  @Inject(UsersService) private readonly usersService: UsersService;

  @Get()
  findUsers(@Param() params: any) {
    return this.usersService.findUsers(params);
  }

  @Get('profile')
  findOwnUser(@CurrentUser() user: User) {
    return this.usersService.findUserById(user.id);
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Patch()
  updateUser(@CurrentUser() user: User, @Body() dto: UpdateUserDTO) {
    return this.usersService.updateUser(user.id, dto);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
