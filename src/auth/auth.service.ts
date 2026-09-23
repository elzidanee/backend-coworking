import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from './entities/user.entity.js';
import { Member } from '../member/entities/member.entity.js';
import { SpaceOwner } from '../admin/entities/space-owner.entity.js';
import { RegisterMemberDto } from './dto/register-member.dto.js';
import { RegisterAdminSpaceDto } from './dto/register-admin-space.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(SpaceOwner) private spaceOwnerRepository: Repository<SpaceOwner>,
    private jwtService: JwtService,
  ) { }

  async registerMember(dto: RegisterMemberDto, idMaker: number) {
    const existing = await this.userRepository.findOne({ where: { username: dto.username, id_maker: idMaker } });
    if (existing) throw new ConflictException('Username sudah digunakan oleh akun lain!');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(this.userRepository.create({
      username: dto.username, password: hashedPassword, role: UserRole.MEMBER, id_maker: idMaker,
    }));

    const member = await this.memberRepository.save(this.memberRepository.create({
      nama_member: dto.nama_member, instansi: dto.instansi, alamat: dto.alamat,
      telp: dto.telp, foto: dto.foto, id_user: user.id, id_maker: idMaker,
    }));

    const access_token = this.jwtService.sign({ sub: user.id, role: user.role, id_maker: idMaker });

    return {
      message: 'Registrasi member berhasil!',
      result: {
        id: user.id, username: user.username, role: user.role,
        member: { id: member.id, nama_member: member.nama_member, instansi: member.instansi, alamat: member.alamat, telp: member.telp, foto: member.foto },
        access_token,
      },
    };
  }

  async registerAdminSpace(dto: RegisterAdminSpaceDto, idMaker: number) {
    const existing = await this.userRepository.findOne({ where: { username: dto.username, id_maker: idMaker } });
    if (existing) throw new ConflictException('Username sudah digunakan oleh akun lain!');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(this.userRepository.create({
      username: dto.username, password: hashedPassword, role: UserRole.ADMIN_SPACE, id_maker: idMaker,
    }));

    const spaceOwner = await this.spaceOwnerRepository.save(this.spaceOwnerRepository.create({
      nama_coworking: dto.nama_coworking, nama_pemilik: dto.nama_pemilik, telp: dto.telp,
      id_user: user.id, id_maker: idMaker,
    }));

    const access_token = this.jwtService.sign({ sub: user.id, role: user.role, id_maker: idMaker });

    return {
      message: 'Registrasi Admin Space berhasil!',
      result: {
        id: user.id, username: user.username, role: user.role,
        space_owner: { id: spaceOwner.id, nama_coworking: spaceOwner.nama_coworking, nama_pemilik: spaceOwner.nama_pemilik, telp: spaceOwner.telp },
        access_token,
      },
    };
  }

  async login(dto: LoginDto, idMaker: number) {
    const user = await this.userRepository.findOne({ where: { username: dto.username, id_maker: idMaker } });
    if (!user) throw new UnauthorizedException('Username atau Password salah!');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Username atau Password salah!');

    const access_token = this.jwtService.sign({ sub: user.id, role: user.role, id_maker: idMaker });

    let member = null;
    let spaceOwner = null;
    if (user.role === UserRole.MEMBER) {
      member = await this.memberRepository.findOne({ where: { id_user: user.id } });
    } else {
      spaceOwner = await this.spaceOwnerRepository.findOne({ where: { id_user: user.id } });
    }

    return {
      message: 'Login berhasil!',
      result: { id: user.id, username: user.username, role: user.role, maker_id: idMaker, member, space_owner: spaceOwner, access_token },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan!');
    }

    if (user.role === UserRole.MEMBER) {
      const member = await this.memberRepository.findOne({ where: { id_user: user.id } });
      return { id: user.id, username: user.username, role: user.role, member };
    }

    const spaceOwner = await this.spaceOwnerRepository.findOne({ where: { id_user: user.id } });
    return { id: user.id, username: user.username, role: user.role, space_owner: spaceOwner };
  }
}