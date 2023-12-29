import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from 'src/common/supabase/supabase.service';

@Injectable()
export class SubscriptionsUsersService {
  private static readonly ENTITY_NAME = 'subscriptions_users';
  @Inject(SupabaseService) private readonly supabaseService: SupabaseService;

  async assignSubscriptionToUser(subcriptionId: string, user: User) {
    const subscription = await this.supabaseService
      .getClient()
      .from('subscriptions')
      .select()
      .eq('id', subcriptionId)
      .single()
      .then(({ data }) => data);

    console.log(subcriptionId, subscription);

    if (!subscription) {
      throw new NotFoundException('subscription is not defined');
    }

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + subscription.duration);
    const data = {
      subscription: subcriptionId,
      user: user?.id,
      expired_at: expiredAt,
    };
    return this.supabaseService
      .getClient()
      .from('subscriptions_users')
      .insert(data)
      .select('*, subscription(*), user(*)')
      .single()
      .then(({ data }) => data);
  }

  getUserSubscription(user?: User) {
    const query = this.supabaseService
      .getClient()
      .from(SubscriptionsUsersService.ENTITY_NAME)
      .select('*, user(*), subscription(*)');

    if (user?.id) {
      return query
        .eq('user', user?.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => data);
    }

    return query
      .order('created_at', { ascending: false })
      .then(({ data }) => data);
  }

  async updateUserSubscriptionStatus(
    userSubscriptionId: string,
    status: string,
  ) {
    const userSubscription = await this.supabaseService
      .getClient()
      .from(SubscriptionsUsersService.ENTITY_NAME)
      .select()
      .eq('id', userSubscriptionId)
      .single()
      .then(({ data }) => data);

    if (!userSubscription) {
      throw new NotFoundException('user subscription is not defined');
    }

    return this.supabaseService
      .getClient()
      .from(SubscriptionsUsersService.ENTITY_NAME)
      .update({ status })
      .eq('id', userSubscriptionId)
      .select('*, user(*), subscription(*)')
      .single()
      .then(({ data }) => data);
  }
}
