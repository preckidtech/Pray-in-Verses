import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class SignupDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsOptional() @IsString() displayName?: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
}
