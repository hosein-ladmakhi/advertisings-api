import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SupabaseModule } from 'src/common/supabase/supabase.module';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  imports: [SupabaseModule],
})
export class CategoriesModule {}
