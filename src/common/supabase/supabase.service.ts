import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class SupabaseService {
  @Inject(ConfigService) private readonly configService: ConfigService;
  @Inject(REQUEST) private readonly request: Request;

  private _supabase: SupabaseClient;

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
