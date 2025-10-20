import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateInviteDto {
  @IsEmail() email: string;
  @IsEnum(Role) role: Role; // EDITOR | MODERATOR | SUPER_ADMIN | USER
}

export class AcceptInviteDto {
  @IsString() token: string;
  @IsString() @MinLength(6) password: string;
  @IsString() name: string;
}

export class UpdateUserRoleDto {
  @IsEnum(Role) role: Role;
}
