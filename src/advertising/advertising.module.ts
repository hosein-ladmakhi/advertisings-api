import { Module } from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import { AdvertisingController } from './advertising.controller';
import { SupabaseModule } from 'src/common/supabase/supabase.module';
import { BaseService } from 'src/common/services/base-service.service';

@Module({
  providers: [AdvertisingService, BaseService],
  controllers: [AdvertisingController],
  imports: [SupabaseModule],
})
export class AdvertisingModule {}
