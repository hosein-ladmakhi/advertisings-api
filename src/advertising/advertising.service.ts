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
import { BaseService } from 'src/common/services/base-service.service';

@Injectable()
export class AdvertisingService extends BaseService<
  CreateAdvertisingDTO,
  EditAdvertisingDTO
> {
  public entity: string = 'advertisings';
  constructor(public superbase: SupabaseService) {
    super();
  }

  async findAllAdvertisings() {
    return this.selectAll(0, 10);
  }

  async findAdvertisingById(id: string) {
    const advertising = await this.select(id, '*, category(*), creator(*)');

    const comments = await this.superbase
      .getClient()
      .from('comments')
      .select('*, parent(*), author(*),children(*)')
      .eq('advertising', id);

    return {
      ...advertising,
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
      await this.edit(id, { likes: advertising.likes } as any);
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
      await this.edit(id, { views: advertising.views } as any);
      return true;
    } catch (error) {
      return false;
    }
  }

  async newComment(author: string, dto: CreateCommentDTO) {
    await this.findAdvertisingById(dto.advertising);
    const comment = await this.superbase
      .getClient()
      .from('comments')
      .insert({
        ...dto,
        author,
      })
      .select()
      .single();

    if (dto.parent) {
      await this.superbase
        .getClient()
        .from('comments')
        .update({ children: comment?.data?.id })
        .eq('id', dto.parent);
    }
    return comment?.data;
  }

  async deleteComment(id: string, author: string) {
    const comment = (
      await this.superbase
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
        await this.superbase
          .getClient()
          .from('comments')
          .update({ children: null })
          .eq('id', comment?.parent);
        await this.superbase
          .getClient()
          .from('comments')
          .delete()
          .eq('id', comment?.parent);
      }

      if (comment?.children) {
        await this.superbase
          .getClient()
          .from('comments')
          .update({ parent: null })
          .eq('id', comment?.children);
        await this.superbase
          .getClient()
          .from('comments')
          .delete()
          .eq('id', comment?.children);
      }

      await this.superbase
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
    const duplicateTitle = await this.superbase
      .getClient()
      .from('advertisings')
      .select()
      .eq('title', dto.title)
      .single();

    if (duplicateTitle?.data?.id) {
      throw new ConflictException('duplicated title');
    }

    const data = {
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
      city: dto.city,
    };

    return this.create(data as any);
  }

  async editAdvertising(dto: EditAdvertisingDTO, creator: string, id: string) {
    const advertising = await this.select(id);

    if (advertising?.creator?.id !== creator) {
      throw new BadRequestException('only creator can update');
    }

    const data = {
      city: dto.city,
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
    };

    return this.edit(id, data);
  }
}
