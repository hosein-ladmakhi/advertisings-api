import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private _supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  getClient() {
    if (!this._supabase) {
      const projectURL = this.configService.get<string>('RPOJECT_URL');
      const apiKey = this.configService.get<string>('API_KEY');
      this._supabase = createClient(projectURL, apiKey, {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
        global: {
          headers: {},
        },
      });
    }
    return this._supabase;
  }
}
