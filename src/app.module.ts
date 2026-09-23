// src/app.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// import semua entity satu-satu
import { Maker } from './maker/entities/maker.entity.js';
import { User } from './auth/entities/user.entity.js';
import { Member } from './member/entities/member.entity.js';
import { SpaceOwner } from './admin/entities/space-owner.entity.js';
import { Space } from './space/entities/space.entity.js';
import { Diskon } from './diskon/entities/diskon.entity.js';
import { Reservasi } from './reservasi/entities/reservasi.entity.js';
import { MakerModule } from './maker/maker.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MakerService } from './maker/maker.service.js';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

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
        entities: [Maker, User, Member, SpaceOwner, Space, Diskon, Reservasi], // ganti dari glob pattern jadi array langsung
        synchronize: true,
      }),
    }),

    MakerModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [MakerService],
})
export class AppModule {}