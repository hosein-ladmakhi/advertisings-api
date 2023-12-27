import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class BaseService<CreateDto, EditDto> {
  @Inject(SupabaseService) private readonly supabaseService: SupabaseService;
  public entity: string;

  constructor() {}

  async create(dto: CreateDto) {
    const entity = await this.supabaseService
      .getClient()
      .from(this.entity)
      .insert(dto)
      ?.select()
      ?.single();
    return entity?.data;
  }

  async edit(id: string, dto: EditDto) {
    await this.select(id);
    const entity = await this.supabaseService
      .getClient()
      .from(this.entity)
      .update(dto)
      .eq('id', id)
      ?.select()
      ?.single();
    return entity?.data;
  }

  async delete(id: string) {
    try {
      await this.select(id);
      const response = await this.supabaseService
        .getClient()
        .from(this.entity)
        .delete({ count: 'exact' })
        .eq('id', id);
      if (response?.count === 0) return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  async select(id: string, select: string = '*'): Promise<any> {
    const entity = await this.supabaseService
      .getClient()
      .from(this.entity)
      .select(select)
      .eq('id', id)
      .single();

    if (!entity?.data) {
      throw new NotFoundException(`${this.entity} is not defined`);
    }

    return entity?.data;
  }

  async selectAll(
    page: number,
    limit: number,
    select: string = '*',
    options = { orderBy: 'created_at', asc: true },
  ) {
    const entities = await this.supabaseService
      .getClient()
      .from(this.entity)
      .select(select)
      .range(page * limit, page * 10 + 10)
      .order(options.orderBy, { ascending: options.asc });

    return entities?.data;
  }
}
