import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { File } from './dtos/file.dto';
import { writeFileSync } from 'fs';

@Injectable()
export class UploadService {
  uploadFile(file: File) {
    const fileExt = path.extname(file.originalname);
    const filename = `${new Date().getTime()}-${Math.floor(
      Math.random() * 1000000000000000,
    )}`;
    const filePath = `public/${filename}${fileExt}`;
    writeFileSync(filePath, file.buffer);
    return filePath;
  }
}
