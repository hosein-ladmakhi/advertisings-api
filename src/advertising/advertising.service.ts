import { Inject, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/common/supabase/supabase.service';

@Injectable()
export class AdvertisingService {
  @Inject(SupabaseService) private readonly supabaseService: SupabaseService;

  async findAllAdvertisings() {
    const response = await this.supabaseService
      .getClient()
      .from('advertisings')
      .select()
      .order('created_at', { ascending: true });

    return response.data;
  }
}
