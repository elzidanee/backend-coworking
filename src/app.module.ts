// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 1. Baca file .env dan sediakan ke seluruh aplikasi
    ConfigModule.forRoot({
      isGlobal: true, // bisa dipakai di module manapun tanpa import ulang
    }),

    // 2. Konfigurasi koneksi database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // HANYA untuk development! auto-bikin tabel dari entity
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}