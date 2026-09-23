import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // aktifkan validasi otomatis dari class-validator di seluruh aplikasi
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // buang field yang nggak didefinisikan di DTO
    transform: true, // ubah tipe data otomatis sesuai DTO
  }));

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors(); // biar bisa diakses dari frontend beda origin nanti

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();