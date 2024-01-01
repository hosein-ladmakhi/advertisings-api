import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { File } from './dtos/file.dto';
import { writeFileSync } from 'fs';
import * as jimp from 'jimp';

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

  async uploadAdvertisingImages(images: File[]) {
    const createdImages = [];
    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      const filename = `${new Date().getTime()}-${Math.floor(
        Math.random() * 100000000,
      )}${path.extname(image.originalname)}`;
      const jimpFile = await jimp.read(image.buffer);
      await jimpFile
        .resize(200, 100)
        .quality(90)
        .write(
          path.join(__dirname, '../..', 'public', `thumbnail-${filename}`),
        );

      await jimpFile
        .resize(350, 180, '^')
        .quality(90)
        .write(path.join(__dirname, '../..', 'public', filename));

      createdImages.push({
        image: `public/${filename}`,
        thumbnail: `public/thumbnail-${filename}`,
      });
    }
    console.log(createdImages);
    return createdImages;
  }
}
