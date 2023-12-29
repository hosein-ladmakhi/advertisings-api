import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsUsersService } from './subscriptions-users.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '@supabase/supabase-js';

@UseGuards(JwtGuard)
@Controller('subscriptions-users')
export class SubscriptionsUsersController {
  @Inject(SubscriptionsUsersService)
  private readonly subscriptionsUserService: SubscriptionsUsersService;

  @Post(':subscriptionId')
  handleAssignSubscriptionToUser(
    @CurrentUser() user: User,
    @Param('subscriptionId') subcriptionId: string,
  ) {
    return this.subscriptionsUserService.assignSubscriptionToUser(
      subcriptionId,
      user,
    );
  }

  @Get('/subscribe')
  handleGetUserSubscription(@CurrentUser() user: User) {
    return this.subscriptionsUserService.getUserSubscription(user);
  }

  @Get()
  handleGetAllUserSubscriptions() {
    return this.subscriptionsUserService.getUserSubscription();
  }

  @Patch('update-status/:subcriptionId')
  handleUpdateUserSubscriptionStatus(
    @Param('subcriptionId') subcriptionId: string,
    @Body() dto: { status: string },
  ) {
    return this.subscriptionsUserService.updateUserSubscriptionStatus(
      subcriptionId,
      dto.status,
    );
  }
}
