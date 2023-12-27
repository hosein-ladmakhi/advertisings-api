import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdvertisingService } from './advertising.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateCommentDTO } from './dtos/create-comment.dto';
import { CreateAdvertisingDTO } from './dtos/create-advertising.dto';
import { EditAdvertisingDTO } from './dtos/edit-advertising.dto';

@UseGuards(JwtGuard)
@Controller('advertising')
export class AdvertisingController {
  @Inject() private readonly advertisingService: AdvertisingService;

  @Get()
  getAdvertisings() {
    return this.advertisingService.findAllAdvertisings();
  }

  @Get(':id')
  getAdvertisingById(@Param('id') id: string) {
    return this.advertisingService.findAdvertisingById(id);
  }

  @Post('like/:id')
  likeOrDislikeAdvertising(@CurrentUser() user: any, @Param('id') id: string) {
    return this.advertisingService.likeOrDislikeAdvertising(id, user.id);
  }

  @Post('view/:id')
  viewAdvertising(@CurrentUser() user: any, @Param('id') id: string) {
    return this.advertisingService.viewAdvertising(id, user.id);
  }

  @Post('comment')
  createComment(@CurrentUser() user: any, @Body() dto: CreateCommentDTO) {
    return this.advertisingService.newComment(user.id, dto);
  }

  @Delete('comment/:id')
  deleteComment(@CurrentUser() user: any, @Param('id') id: string) {
    return this.advertisingService.deleteComment(id, user?.id);
  }

  @Post()
  createAdvertising(
    @CurrentUser() user: any,
    @Body() dto: CreateAdvertisingDTO,
  ) {
    return this.advertisingService.createAdvertising(dto, user?.id);
  }

  @Patch(':id')
  editAdvertising(
    @CurrentUser() user: any,
    @Body() dto: EditAdvertisingDTO,
    @Param('id') id: string,
  ) {
    return this.advertisingService.editAdvertising(dto, user?.id, id);
  }
}
