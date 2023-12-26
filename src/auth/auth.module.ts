import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseModule } from 'src/common/supabase/supabase.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtGuard],
  exports: [JwtStrategy, JwtGuard],
  imports: [
    SupabaseModule,
    JwtModule.register({ signOptions: { expiresIn: '1h' }, secret: 'xxx' }),
  ],
})
export class AuthModule {}
