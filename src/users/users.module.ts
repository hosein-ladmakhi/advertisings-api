import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SupabaseModule } from 'src/common/supabase/supabase.module';
import { BaseService } from 'src/common/services/base-service.service';

@Module({
  providers: [UsersService, BaseService],
  controllers: [UsersController],
  imports: [SupabaseModule],
})
export class UsersModule {}
