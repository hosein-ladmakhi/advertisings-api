import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { SupabaseModule } from 'src/common/supabase/supabase.module';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [SupabaseModule],
})
export class UploadModule {}
