import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterMemberDto } from './dto/register-member.dto.js';
import { RegisterAdminSpaceDto } from './dto/register-admin-space.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { MakerKeyGuard } from '../common/guards/maker-key.guard.js';
import { CurrentMaker } from '../common/decorators/current-maker.decorator.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import * as currentMakerInterface from '../common/interfaces/current-maker.interface.js'; // import ini

@Controller('api/auth')
@UseGuards(MakerKeyGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/member')
  registerMember(@Body() dto: RegisterMemberDto, @CurrentMaker() maker: currentMakerInterface.CurrentMakerPayload) {
    return this.authService.registerMember(dto, maker.id);
  }

  @Post('register/admin-space')
  registerAdminSpace(@Body() dto: RegisterAdminSpaceDto, @CurrentMaker() maker: currentMakerInterface.CurrentMakerPayload) {
    return this.authService.registerAdminSpace(dto, maker.id);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @CurrentMaker() maker: currentMakerInterface.CurrentMakerPayload) {
    return this.authService.login(dto, maker.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.sub);
  }
}