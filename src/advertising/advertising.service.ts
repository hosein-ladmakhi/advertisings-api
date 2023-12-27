import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from 'src/common/supabase/supabase.service';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { CreateAdvertisingDTO } from './dtos/create-advertising.dto';
import { EditAdvertisingDTO } from './dtos/edit-advertising.dto';

@Injectable()
export class AdvertisingService {
  @Inject(SupabaseService) private readonly supabaseService: SupabaseService;

  async findAllAdvertisings() {
    const response = await this.supabaseService
      .getClient()
      .from('advertisings')
      .select()
      .order('created_at', { ascending: true });

    return response.data;
  }

  async findAdvertisingById(id: string) {
    const response = await this.supabaseService
      .getClient()
      .from('advertisings')
      .select('*, category(*), creator(*)')
      .eq('id', id)
      .single();

    if (!response) {
      throw new NotFoundException('advertising not defined');
    }

    const comments = await this.supabaseService
      .getClient()
      .from('comments')
      .select('*, parent(*), author(*),children(*)')
      .eq('advertising', id);

    return {
      ...response.data,
      comments: comments?.data?.filter((e) => !e?.parent),
    };
  }

  async likeOrDislikeAdvertising(id: string, creator: string) {
    const advertising = await this.findAdvertisingById(id);
    try {
      if (advertising.likes.find((element) => element === creator))
        advertising.likes = advertising.likes.filter(
          (element) => element !== creator,
        );
      else advertising.likes.push(creator);
      await this.updateAdvertising(id, { likes: advertising.likes });
      return true;
    } catch (error) {
      return false;
    }
  }

  async viewAdvertising(id: string, creator: string) {
    const advertising = await this.findAdvertisingById(id);
    try {
      if (!advertising.views.find((element) => element === creator)) {
        advertising.views.push(creator);
      }
      await this.updateAdvertising(id, { views: advertising.views });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateAdvertising(id: string, dto: any) {
    await this.supabaseService
      .getClient()
      .from('advertisings')
      .update(dto)
      .eq('id', id);
    return this.findAdvertisingById(id);
  }

  async newComment(author: string, dto: CreateCommentDTO) {
    await this.findAdvertisingById(dto.advertising);
    const comment = await this.supabaseService
      .getClient()
      .from('comments')
      .insert({
        ...dto,
        author,
      })
      .select()
      .single();

    if (dto.parent) {
      await this.supabaseService
        .getClient()
        .from('comments')
        .update({ children: comment?.data?.id })
        .eq('id', dto.parent);
    }
    return comment?.data;
  }

  async deleteComment(id: string, author: string) {
    const comment = (
      await this.supabaseService
        .getClient()
        .from('comments')
        .select()
        .eq('id', id)
        .single()
    )?.data;

    if (comment?.author !== author)
      throw new BadRequestException('only author can delete');

    try {
      if (comment?.parent) {
        console.log(
          'update parent',
          await this.supabaseService
            .getClient()
            .from('comments')
            .update({ children: null })
            .eq('id', comment?.parent),
        );
        console.log(
          await this.supabaseService
            .getClient()
            .from('comments')
            .delete()
            .eq('id', comment?.parent),
        );
      }

      if (comment?.children) {
        console.log(
          'update children',
          await this.supabaseService
            .getClient()
            .from('comments')
            .update({ parent: null })
            .eq('id', comment?.children),
        );
        console.log(
          await this.supabaseService
            .getClient()
            .from('comments')
            .delete()
            .eq('id', comment?.children),
        );
      }

      await this.supabaseService
        .getClient()
        .from('comments')
        .delete()
        .eq('id', comment?.id);

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async createAdvertising(dto: CreateAdvertisingDTO, creator: string) {
    const duplicateTitle = await this.supabaseService
      .getClient()
      .from('advertisings')
      .select()
      .eq('title', dto.title)
      .single();

    if (duplicateTitle?.data?.id) {
      throw new ConflictException('duplicated title');
    }

    const response = await this.supabaseService
      .getClient()
      .from('advertisings')
      .insert({
        images: dto.images,
        title: dto.title,
        content: dto.content,
        category: dto.category,
        creator,
        is_visible: dto.isVisible,
        min_price: dto.minPrice,
        max_price: dto.maxPrice,
        location: dto.location,
        tags: dto.tags,
        likeable: dto.isLikeable,
        commetable: dto.isCommentable,
        viewable: dto.isViewable,
        likes: [],
        views: [],
      })
      .select();

    return response?.data;
  }

  async editAdvertising(dto: EditAdvertisingDTO, creator: string, id: string) {
    const advertising = await this.findAdvertisingById(id);

    if (advertising?.creator?.id !== creator) {
      throw new BadRequestException('only creator can update');
    }
    const response = await this.supabaseService
      .getClient()
      .from('advertisings')
      .update({
        images: dto.images || advertising.images,
        title: dto.title || advertising.title,
        content: dto.content || advertising.content,
        category: dto.category || advertising.category,
        is_visible: dto.isVisible || advertising.is_visible,
        min_price: dto.minPrice || advertising.min_price,
        max_price: dto.maxPrice || advertising.max_price,
        location: dto.location || advertising.location,
        tags: dto.tags || advertising.tags,
        likeable: dto.isLikeable || advertising.likeable,
        commetable: dto.isCommentable || advertising.commentable,
        viewable: dto.isViewable || advertising.viewable,
      })
      .eq('id', id)
      .select()
      .single();

    console.log(response);

    return response?.data;
  }
}
