import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = await app.get(ConfigService);
  const port = await configService.get<number>('PORT');

  app.use('/public', express.static(path.join(__dirname, '..', 'public')));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.listen(port, () => {
    console.log(`the server is running at port ${port}`);
  });
};

bootstrap();
