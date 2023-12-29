import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDTO } from './dtos/create-subscription.dto';
import { EditSubscriptionDTO } from './dtos/edit-subscription.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  @Inject(SubscriptionsService)
  private readonly subscriptionService: SubscriptionsService;

  @Post()
  createSubscription(@Body() body: CreateSubscriptionDTO) {
    return this.subscriptionService.createSubscription(body);
  }

  @Get()
  getSubscriptions(@Param() params: any) {
    return this.subscriptionService.selectSubscriptions(params);
  }

  @Get(':id')
  getSubscriptionById(@Param('id') id: string) {
    return this.subscriptionService.selectSubscription(id);
  }

  @Delete(':id')
  deleteSubscriptionById(@Param('id') id: string) {
    return this.subscriptionService.deleteSubscription(id);
  }

  @Patch(':id')
  updateSubscription(
    @Body() dto: EditSubscriptionDTO,
    @Param('id') id: string,
  ) {
    return this.subscriptionService.editSubscription(id, dto);
  }
}
