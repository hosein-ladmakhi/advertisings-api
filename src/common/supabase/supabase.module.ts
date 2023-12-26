import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [SupabaseService, ConfigService],
  imports: [ConfigModule, ConfigModule],
  exports: [SupabaseService],
})
export class SupabaseModule {}
