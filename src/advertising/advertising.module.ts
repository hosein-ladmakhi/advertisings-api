import { Module } from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import { AdvertisingController } from './advertising.controller';
import { SupabaseModule } from 'src/common/supabase/supabase.module';

@Module({
  providers: [AdvertisingService],
  controllers: [AdvertisingController],
  imports: [SupabaseModule],
})
export class AdvertisingModule {}
