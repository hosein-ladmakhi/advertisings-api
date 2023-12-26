import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from 'src/common/supabase/supabase.service';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { CreateCategoryDTO } from './dtos/create-category.dto';

@Injectable()
export class CategoriesService {
  @Inject(SupabaseService) private readonly supabaseService: SupabaseService;

  async deleteCategories(id: string) {
    const response = await this.supabaseService
      .getClient()
      .from('categories')
      .delete({ count: 'exact' })
      .eq('id', id);
    if (response?.count === 0) return false;
    return true;
  }

  async updateCategories(id: string, dto: UpdateCategoryDTO) {
    const checkUniqueName = await this.supabaseService
      .getClient()
      .from('categories')
      .select()
      .eq('name', dto.name)
      .neq('id', id)
      .single();
    if (checkUniqueName?.data?.id) {
      throw new ConflictException('duplicated name');
    }

    await this.supabaseService
      .getClient()
      .from('categories')
      .update(dto)
      .eq('id', id);

    return this.findCategoryById(id);
  }

  async createCategories(dto: CreateCategoryDTO) {
    const checkUniqueName = await this.supabaseService
      .getClient()
      .from('categories')
      .select()
      .eq('name', dto.name)
      .single();
    if (checkUniqueName?.data?.id) {
      throw new ConflictException('duplicated name');
    }

    await this.supabaseService.getClient().from('categories').insert(dto);

    const category = await this.supabaseService
      .getClient()
      .from('categories')
      .select()
      .eq('name', dto.name)
      .single();

    return category?.data;
  }

  async findCategoryById(id: string) {
    const category = await this.supabaseService
      .getClient()
      .from('categories')
      .select()
      .eq('id', id)
      .single();

    if (!category?.data) {
      throw new NotFoundException('category is not defined');
    }

    return category?.data;
  }

  async findCategories() {
    const categories = await this.supabaseService
      .getClient()
      .from('categories')
      .select()
      .order('created_at', { ascending: false });

    return categories?.data;
  }
}
