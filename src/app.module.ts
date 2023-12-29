import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { UploadModule } from './upload/upload.module';
import { AdvertisingModule } from './advertising/advertising.module';
import { LocationsModule } from './locations/locations.module';
import { ChatsModule } from './chats/chats.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SubscriptionsUsersModule } from './subscriptions-users/subscriptions-users.module';

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
    SubscriptionsModule,
    SubscriptionsUsersModule,
  ],
})
export class AppModule {}
