import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { CreateAdvertisingDTO } from './dtos/create-advertising.dto';
import { EditAdvertisingDTO } from './dtos/edit-advertising.dto';
import { User } from '@supabase/supabase-js';

@UseGuards(JwtGuard)
@Controller('advertising')
export class AdvertisingController {
  @Inject() private readonly advertisingService: AdvertisingService;

  @Get()
  getAdvertisings(@Query() params: Record<string, any>) {
    return this.advertisingService.findAllAdvertisings(params);
  }
  @Get('related/owner/:id/:owner')
  getRelatedOwnerAdvertisings(
    @Query() params: Record<string, any>,
    @Param('id') id: string,
    @Param('owner') owner: string,
  ) {
    return this.advertisingService.findAllRelatedOwnerAdvertisings(
      id,
      owner,
      params,
    );
  }

  @Get('related/:id/:category')
  getRelatedAdvertisings(
    @Query() params: Record<string, any>,
    @Param('id') id: string,
    @Param('category') category: string,
  ) {
    return this.advertisingService.findAllRelatedAdvertisings(
      id,
      category,
      params,
    );
  }

  @Get('own')
  getOwnAdvertisings(
    @Query() params: Record<string, any>,
    @CurrentUser() user: User,
  ) {
    return this.advertisingService.findAllUserAdvertisings(params, user);
  }

  @Get(':id')
  getAdvertisingById(@Param('id') id: string) {
    return this.advertisingService.findAdvertisingById(id);
  }

  @Post('like/:id')
  likeOrDislikeAdvertising(@CurrentUser() user: User, @Param('id') id: string) {
    return this.advertisingService.likeOrDislikeAdvertising(id, user.id);
  }

  @Post('view/:id')
  viewAdvertising(@CurrentUser() user: User, @Param('id') id: string) {
    return this.advertisingService.viewAdvertising(id, user.id);
  }

  @Post('comment')
  createComment(@CurrentUser() user: User, @Body() dto: CreateCommentDTO) {
    return this.advertisingService.newComment(user.id, dto);
  }

  @Delete('comment/:id')
  deleteComment(@CurrentUser() user: User, @Param('id') id: string) {
    return this.advertisingService.deleteComment(id, user?.id);
  }

  @Post()
  createAdvertising(
    @CurrentUser() user: User,
    @Body() dto: CreateAdvertisingDTO,
  ) {
    return this.advertisingService.createAdvertising(dto, user?.id);
  }

  @Patch(':id')
  editAdvertising(
    @CurrentUser() user: User,
    @Body() dto: EditAdvertisingDTO,
    @Param('id') id: string,
  ) {
    return this.advertisingService.editAdvertising(dto, user?.id, id);
  }
}
