export class CreateSubscriptionDTO {
  name: string;
  price: number;
  count: number;
  duration: number;
  canUseChat: boolean;
  canUseReport: boolean;
  canUseTelegramBot: boolean;
  canUseAppPhone: boolean;
  canUseViewNotification: boolean;
  canUseComment: boolean;
}
