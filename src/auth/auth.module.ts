import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { User } from './entities/user.entity.js';
import { Member } from '../member/entities/member.entity.js';
import { SpaceOwner } from '../admin/entities/space-owner.entity.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { MakerModule } from '../maker/maker.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Member, SpaceOwner]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
    MakerModule, // tambahkan ini supaya bisa inject MakerService di AuthService
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}