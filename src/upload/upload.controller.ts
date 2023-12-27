import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { File } from './dtos/file.dto';
import * as jimp from 'jimp';

@Controller('upload')
export class UploadController {
  @Inject(UploadService) private readonly uploadService: UploadService;

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() uplaodedFile: File) {
    return this.uploadService.uploadFile(uplaodedFile);
  }

  @Post('advertising')
  @UseInterceptors(FilesInterceptor('images'))
  imageWithThumbnail(@UploadedFiles() uplaodedFile: File[]) {
    return this.uploadService.uploadAdvertisingImages(uplaodedFile);
  }
}
