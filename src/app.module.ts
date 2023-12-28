import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadModule } from './upload/upload.module';
import { AdvertisingModule } from './advertising/advertising.module';
import { BaseService } from './common/services/base-service.service';
import { LocationsModule } from './locations/locations.module';
import { ChatsModule } from './chats/chats.module';
import { WsGuardService } from './common/services/ws-guard.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    SupabaseModule,
    AuthModule,
    UsersModule,
    CategoriesModule,
    UploadModule,
    AdvertisingModule,
    LocationsModule,
    ChatsModule,
  ],
  providers: [BaseService],
  exports: [BaseService],
})
export class AppModule {}
