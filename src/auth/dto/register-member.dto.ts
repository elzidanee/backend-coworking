import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterMemberDto {
  @IsNotEmpty() username: string;
  @IsNotEmpty() @MinLength(6) password: string;
  @IsNotEmpty() nama_member: string;
  @IsNotEmpty() instansi: string;
  @IsNotEmpty() alamat: string;
  @IsNotEmpty() telp: string;
  @IsOptional() foto?: string;
}