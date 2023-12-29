import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { SupabaseService } from 'src/common/supabase/supabase.service';

@Injectable()
export class UsersService {
  @Inject() private readonly supabaseService: SupabaseService;
  constructor() {}

  async deleteUser(id: string) {
    await this.findUserById(id);
    try {
      const response = await this.supabaseService
        .getClient()
        .from('users')
        .delete({ count: 'exact' })
        .eq('id', id);
      if (response?.count === 0) return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateUser(id: string, dto: UpdateUserDTO) {
    if (dto.username) {
      const checkUsername = await this.supabaseService
        .getClient()
        .from('categories')
        .select()
        .eq('username', dto.username)
        .neq('id', id)
        .single();
      if (checkUsername?.data?.id) {
        throw new ConflictException('duplicated username');
      }
    }

    if (dto.email) {
      const checkEmail = await this.supabaseService
        .getClient()
        .from('categories')
        .select()
        .eq('email', dto.email)
        .neq('id', id)
        .single();
      if (checkEmail?.data?.id) {
        throw new ConflictException('duplicated email');
      }
    }

    return this.supabaseService
      .getClient()
      .from('users')
      .update(dto)
      .eq('id', id)
      .select()
      .single()
      .then(({ data }) => data);
  }

  async findUserById(id: string) {
    const user = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
      ?.then(({ data }) => data);

    if (!user) {
      throw new NotFoundException('user is not defined');
    }

    return user;
  }

  async findUsers(params: any) {
    const page = params.page || 0;
    const limit = params.limit || 10;

    const entities = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .range(page * limit, page * limit + limit)
      .order('created_at', { ascending: false });

    return entities?.data;
  }
}
