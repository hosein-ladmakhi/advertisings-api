import { Inject, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/common/supabase/supabase.service';

@Injectable()
export class ChatsService {
  @Inject(SupabaseService) private readonly supabaseService: SupabaseService;

  getChats(sender: string, receiver: string) {
    return this.supabaseService
      .getClient()
      .from('chats')
      .select('*, sender(*), receiver(*), reply(*)')
      .or(
        `sender.eq.${sender},sender.eq.${receiver},receiver.eq.${sender},receiver.eq.${receiver}`,
      )
      .order('created_at', { ascending: true })
      ?.then(({ data }) => data);
  }

  getChatsUser(user: string) {
    return this.supabaseService
      .getClient()
      .from('chats')
      .select('*, sender(*), receiver(*), reply(*)')
      .or(`sender.eq.${user},receiver.eq.${user}`)
      .order('created_at', { ascending: true })
      ?.then(({ data }) =>
        data?.reduce((result, item) => {
          console.log(item);
          if (item.sender?.id !== user && item.receiver?.id === user) {
            if (
              !result.find((element) => element.user?.id === item.sender.id)
            ) {
              result.push({ user: item.sender, message: item });
            }
          }
          if (item.sender?.id === user && item.receiver?.id !== user) {
            if (
              !result.find((element) => element.user?.id === item.receiver.id)
            ) {
              result.push({ user: item.receiver, message: item });
            }
          }
          return result;
        }, []),
      );
  }
}
