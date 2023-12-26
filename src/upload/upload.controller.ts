import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { File } from './dtos/file.dto';

@Controller('upload')
export class UploadController {
  @Inject(UploadService) private readonly uploadService: UploadService;

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() uplaodedFile: File) {
    return this.uploadService.uploadFile(uplaodedFile);
  }
}
