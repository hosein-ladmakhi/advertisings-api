import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from 'src/common/supabase/supabase.service';
import { LoginDTO } from './dtos/login.dto';
import { SignupDTO } from './dtos/signup.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  @Inject(SupabaseService)
  private readonly supabaseService: SupabaseService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async login(dto: LoginDTO) {
    const user = await this.supabaseService
      .getClient()
      .from('users')
      .select()
      .eq('email', dto.email)
      .single();
    if (!user?.data?.id) {
      throw new NotFoundException('user is not found');
    }

    const comparePassword = await bcrypt.compare(
      dto.password,
      user.data.password,
    );

    if (!comparePassword) {
      throw new NotFoundException('user is not found');
    }

    const token = await this.jwtService.sign({ id: user.data.id });
    return { token };
  }

  async signup(dto: SignupDTO) {
    dto.password = await bcrypt.hash(dto.password, 8);
    const response = await this.supabaseService
      .getClient()
      .from('users')
      .insert(dto);

    if (response.status === 201) {
      const user = await this.supabaseService
        .getClient()
        .from('users')
        .select()
        .eq('email', dto.email)
        .single();
      const token = await this.jwtService.sign({ id: user.data.id });
      return { token };
    }

    return {};
  }
}
