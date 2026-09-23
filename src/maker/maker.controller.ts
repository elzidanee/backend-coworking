import { Controller, Post, Get, Body } from '@nestjs/common';
import { MakerService } from './maker.service.js';
import { RegisterMakerDto } from './dto/register-maker.dto.js';
import { LoginMakerDto } from './dto/login-maker.dto.js';

@Controller('api/maker')
export class MakerController {
  constructor(private readonly makerService: MakerService) {}

  @Post('register')
  register(@Body() dto: RegisterMakerDto) {
    return this.makerService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginMakerDto) {
    return this.makerService.login(dto);
  }
}