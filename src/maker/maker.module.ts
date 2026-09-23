import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MakerService } from './maker.service.js';
import { MakerController } from './maker.controller.js';
import { Maker } from './entities/maker.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Maker]), // daftarkan Repository<Maker> supaya bisa di-inject
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' }, // token berlaku 7 hari
      }),
    }),
  ],
  controllers: [MakerController],
  providers: [MakerService],
  exports: [MakerService], // biar module lain bisa pakai MakerService (untuk guard nanti)
})
export class MakerModule {}