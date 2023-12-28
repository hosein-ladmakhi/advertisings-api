import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from 'src/common/supabase/supabase.service';

@Injectable()
export class WsGuardService {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(SupabaseService)
  private readonly supabaseService: SupabaseService;

  async verify(token: string) {
    try {
      const response = await this.jwtService.verify(token);
      const user = await this.supabaseService
        .getClient()
        .from('users')
        .select()
        .eq('id', response?.id)
        .single();

      return user?.data;
    } catch (error) {
      return {};
    }
  }
}
