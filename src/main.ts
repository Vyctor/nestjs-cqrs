import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, unlinkSync } from 'fs';
import { AppService } from './app.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  deleteDbFile('db.sqlite');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const appService = app.get(AppService);
  await appService.seed();

  await app.listen(3000);
}

function deleteDbFile(dbFileName: string) {
  if (existsSync(dbFileName)) {
    unlinkSync(dbFileName);
  }
}
bootstrap();
