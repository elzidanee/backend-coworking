import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Maker } from './entities/maker.entity.js';
import { RegisterMakerDto } from './dto/register-maker.dto.js';
import { LoginMakerDto } from './dto/login-maker.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MakerService {
  constructor(
    @InjectRepository(Maker)
    private makerRepository: Repository<Maker>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterMakerDto) {
    // 1. Cek apakah username/email sudah dipakai
    const existing = await this.makerRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existing) {
      throw new ConflictException('Username atau Email sudah terdaftar sebagai App Maker!');
    }

    // 2. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Generate app_key unik
    const appKey = 'mk_' + randomBytes(16).toString('hex');

    // 4. Simpan ke database
    const maker = this.makerRepository.create({
      name: dto.name,
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
      app_key: appKey,
    });
    const saved = await this.makerRepository.save(maker);

    // 5. Buatkan token JWT juga (opsional, sesuai contoh response di soal)
    const access_token = this.jwtService.sign({ sub: saved.id, type: 'maker' });

    return {
      id: saved.id,
      name: saved.name,
      username: saved.username,
      email: saved.email,
      app_key: saved.app_key,
      created_at: saved.created_at,
      updated_at: saved.updated_at,
      access_token,
    };
  }

  async login(dto: LoginMakerDto) {
    const maker = await this.makerRepository.findOne({
      where: [{ username: dto.usernameOrEmail }, { email: dto.usernameOrEmail }],
    });

    if (!maker) {
      throw new UnauthorizedException('Kredensial login App Maker salah!');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, maker.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Kredensial login App Maker salah!');
    }

    const access_token = this.jwtService.sign({ sub: maker.id, type: 'maker' });

    return {
      id: maker.id,
      name: maker.name,
      username: maker.username,
      email: maker.email,
      app_key: maker.app_key,
      access_token,
    };
  }

  async findByAppKey(appKey: string) {
    return this.makerRepository.findOne({ where: { app_key: appKey } });
  }
}