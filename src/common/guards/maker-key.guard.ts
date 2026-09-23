import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { MakerService } from '../../maker/maker.service.js';

@Injectable()
export class MakerKeyGuard implements CanActivate {
  constructor(private makerService: MakerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const appKey = request.headers['x-maker-key'] || request.headers['x-app-key'];

    if (!appKey) {
      throw new UnauthorizedException('Header x-maker-key wajib disertakan!');
    }

    const maker = await this.makerService.findByAppKey(appKey);
    if (!maker) {
      throw new UnauthorizedException('App Key tidak valid!');
    }

    request.maker = maker; // "titip" data maker ke request, supaya bisa diambil lagi nanti
    return true;
  }
}