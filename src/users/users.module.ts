import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SupabaseModule } from 'src/common/supabase/supabase.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [SupabaseModule],
})
export class UsersModule {}
