import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from 'src/common/supabase/supabase.service';
import { UpdateUserDTO } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  @Inject(SupabaseService) private readonly supabaseService: SupabaseService;

  async deleteUser(id: string) {
    const response = await this.supabaseService
      .getClient()
      .from('users')
      .delete({ count: 'exact' })
      .eq('id', id);
    if (response?.count === 0) return false;
    return true;
  }

  async updateUser(id: string, dto: UpdateUserDTO) {
    await this.supabaseService
      .getClient()
      .from('users')
      .update(dto)
      .eq('id', id);

    return this.findUserById(id);
  }

  async findUserById(id: string) {
    const user = await this.supabaseService
      .getClient()
      .from('users')
      .select()
      .eq('id', id)
      .single();

    if (!user?.data) {
      throw new NotFoundException('user is not defined');
    }

    return user?.data;
  }

  async findUsers() {
    const users = await this.supabaseService
      .getClient()
      .from('users')
      .select()
      .order('created_at', { ascending: false });

    return users?.data;
  }
}
