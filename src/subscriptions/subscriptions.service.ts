import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubscriptionDTO } from './dtos/create-subscription.dto';
import { EditSubscriptionDTO } from './dtos/edit-subscription.dto';
import { SupabaseService } from 'src/common/supabase/supabase.service';

interface Entity {
  name: string;
  price: number;
  duration: number;
  advertising_count: number;
  can_use_comment: boolean;
  can_use_view_notification: boolean;
  can_use_app_phone: boolean;
  can_use_telegram_bot: boolean;
  can_use_report: boolean;
  can_use_chat: boolean;
}

@Injectable()
export class SubscriptionsService {
  public entity: string = 'subscriptions';

  @Inject() private readonly supabaseService: SupabaseService;

  async createSubscription(dto: CreateSubscriptionDTO) {
    const duplicateName = await this.supabaseService
      .getClient()
      .from(this.entity)
      .select()
      .eq('name', dto.name)
      .single()
      ?.then(({ data }) => data);

    if (duplicateName) {
      throw new ConflictException('duplicated name');
    }

    const data: Entity = {
      name: dto.name,
      price: dto.price,
      duration: dto.duration,
      advertising_count: dto.count,
      can_use_comment: dto.canUseComment,
      can_use_view_notification: dto.canUseViewNotification,
      can_use_app_phone: dto.canUseAppPhone,
      can_use_telegram_bot: dto.canUseTelegramBot,
      can_use_report: dto.canUseReport,
      can_use_chat: dto.canUseChat,
    };

    return this.supabaseService
      .getClient()
      .from(this.entity)
      .insert(data)
      ?.select()
      ?.single()
      ?.then(({ data }) => data);
  }

  async editSubscription(id: string, dto: EditSubscriptionDTO) {
    const duplicateName = await this.supabaseService
      .getClient()
      .from(this.entity)
      .select()
      .eq('name', dto.name)
      .neq('id', id)
      .single()
      ?.then(({ data }) => data);

    if (duplicateName) {
      throw new ConflictException('duplicated name');
    }

    const subscription = await this.selectSubscription(id);

    const data: Entity = {
      name: dto.name || subscription?.name,
      price: dto.price || subscription?.price,
      duration: dto.duration || subscription?.duration,
      advertising_count: dto.count || subscription?.advertising_count,
      can_use_comment: dto.canUseComment || subscription?.can_use_comment,
      can_use_view_notification:
        dto.canUseViewNotification || subscription?.can_use_view_notification,
      can_use_app_phone: dto.canUseAppPhone || subscription?.can_use_app_phone,
      can_use_telegram_bot:
        dto.canUseTelegramBot || subscription?.can_use_telegram_bot,
      can_use_report: dto.canUseReport || subscription?.can_use_report,
      can_use_chat: dto.canUseChat || subscription?.can_use_chat,
    };

    return this.supabaseService
      .getClient()
      .from(this.entity)
      .update(data)
      .eq('id', id)
      ?.select()
      ?.single()
      ?.then(({ data }) => data);
  }

  async selectSubscription(id: string) {
    const subscrption = await this.supabaseService
      .getClient()
      .from(this.entity)
      .select('*')
      .eq('id', id)
      .single()
      ?.then(({ data }) => data);

    if (!subscrption) {
      throw new NotFoundException(`subscription is not defined`);
    }

    return subscrption;
  }

  async selectSubscriptions(params: any) {
    const page = params.page || 0;
    const limit = params.limit || 10;

    const entities = await this.supabaseService
      .getClient()
      .from(this.entity)
      .select('*')
      .range(page * limit, page * limit + limit)
      .order('created_at', { ascending: false });

    return entities?.data;
  }

  async deleteSubscription(id: string) {
    try {
      const response = await this.supabaseService
        .getClient()
        .from(this.entity)
        .delete({ count: 'exact' })
        .eq('id', id);
      if (response?.count === 0) return false;
      return true;
    } catch (error) {
      return false;
    }
  }
}
