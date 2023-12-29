import { Module } from '@nestjs/common';
import { SubscriptionsUsersService } from './subscriptions-users.service';
import { SubscriptionsUsersController } from './subscriptions-users.controller';
import { SupabaseModule } from 'src/common/supabase/supabase.module';

@Module({
  providers: [SubscriptionsUsersService],
  controllers: [SubscriptionsUsersController],
  imports: [SupabaseModule],
})
export class SubscriptionsUsersModule {}
