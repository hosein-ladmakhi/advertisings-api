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
}
