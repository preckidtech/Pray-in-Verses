import { IsEnum, IsOptional, IsString, MinLength, IsArray } from 'class-validator';
import { PrayerStatus } from '@prisma/client';

export class CreatePrayerPointDto {
  @IsString() @MinLength(1)
  title: string;

  @IsString() @MinLength(1)
  body: string;

  @IsOptional() @IsArray()
  tags?: string[];
}

export class UpdatePrayerPointDto {
  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  body?: string;

  @IsOptional() @IsArray()
  tags?: string[];

  @IsOptional() @IsEnum(PrayerStatus)
  status?: PrayerStatus;
}
