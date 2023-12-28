import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/common/supabase/supabase.service';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { BaseService } from 'src/common/services/base-service.service';

@Injectable()
export class CategoriesService extends BaseService<
  CreateCategoryDTO,
  UpdateCategoryDTO
> {
  public entity: string = 'categories';
  @Inject(SupabaseService)
  private readonly supabaseClientService: SupabaseService;

  async deleteCategories(id: string) {
    const category = await this.select(id);
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
    return this.delete(id);
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
    const category = await this.edit(id, dto);
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

    const category = await this.create(dto);

    if (dto.parent) {
      this.updateCategories(dto.parent, { children: category.id });
    }

    return category;
  }

  async findCategoryById(id: string) {
    return this.select(id);
  }

  async findCategories() {
    return this.selectAll(0, 10, '*');
  }
}
