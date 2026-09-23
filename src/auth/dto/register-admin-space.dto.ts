import { IsNotEmpty, MinLength } from 'class-validator';

export class RegisterAdminSpaceDto {
  @IsNotEmpty() username: string;
  @IsNotEmpty() @MinLength(6) password: string;
  @IsNotEmpty() nama_coworking: string;
  @IsNotEmpty() nama_pemilik: string;
  @IsNotEmpty() telp: string;
}