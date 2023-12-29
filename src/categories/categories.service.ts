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
  @Inject(SupabaseService)
  private readonly supabaseClientService: SupabaseService;

  async deleteCategories(id: string) {
    const category = await this.supabaseClientService
      .getClient()
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
      ?.then(({ data }) => data);

    if (category?.parent) {
      await this.supabaseClientService
        .getClient()
        .from('categories')
        .update({ children: null })
        .eq('id', category?.parent);
      await this.supabaseClientService
        .getClient()
        .from('categories')
        .delete()
        .eq('id', category?.parent);
    }

    if (category?.children) {
      await this.supabaseClientService
        .getClient()
        .from('categories')
        .update({ parent: null })
        .eq('id', category?.children);
      await this.supabaseClientService
        .getClient()
        .from('categories')
        .delete()
        .eq('id', category?.children);
    }
    try {
      const response = await this.supabaseClientService
        .getClient()
        .from('categories')
        .delete({ count: 'exact' })
        .eq('id', id);
      if (response?.count === 0) return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateCategories(id: string, dto: UpdateCategoryDTO) {
    const checkUniqueName = await this.supabaseClientService
      .getClient()
      .from('categories')
      .select()
      .eq('name', dto.name)
      .neq('id', id)
      .single();
    if (checkUniqueName?.data?.id) {
      throw new ConflictException('duplicated name');
    }
    const category = await this.supabaseClientService
      .getClient()
      .from('categories')
      .update(dto)
      .eq('id', id)
      ?.select()
      ?.single()
      ?.then(({ data }) => data);

    if (dto.parent && category.parent !== dto.parent) {
      await this.updateCategories(dto.parent, { children: category.id });
    }
    return category;
  }

  async createCategories(dto: CreateCategoryDTO) {
    const checkUniqueName = await this.supabaseClientService
      .getClient()
      .from('categories')
      .select()
      .eq('name', dto.name)
      .single();

    if (checkUniqueName?.data?.id) {
      throw new ConflictException('duplicated name');
    }

    const category = await this.supabaseClientService
      .getClient()
      .from('categories')
      .insert(dto)
      ?.select()
      ?.single()
      ?.then(({ data }) => data);

    if (dto.parent) {
      this.updateCategories(dto.parent, { children: category.id });
    }

    return category;
  }

  async findCategoryById(id: string) {
    const category = await this.supabaseClientService
      .getClient()
      .from('categories')
      .select('*, parent(*), children(*)')
      .eq('id', id)
      .single()
      ?.then(({ data }) => data);

    if (!category) {
      throw new NotFoundException(`categories is not defined`);
    }

    return category;
  }

  async findCategories(params: any) {
    const page = params.page || 0;
    const limit = params.limit || 10;

    const entities = await this.supabaseClientService
      .getClient()
      .from('categories')
      .select('*, parent(*), children(*)')
      .range(page * limit, page * limit + limit)
      .order('created_at', { ascending: false });

    return entities?.data;
  }
}
