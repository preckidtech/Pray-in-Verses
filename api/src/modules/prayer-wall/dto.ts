import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePrayerRequestDto {
  @IsString() @MinLength(3) title: string;
  @IsString() @MinLength(10) description: string;
  @IsString() category: string;
  @IsOptional() @IsBoolean() urgent?: boolean;
  @IsOptional() @IsBoolean() anonymous?: boolean;
}

export class AddCommentDto {
  @IsString() @MinLength(1) body: string;
}
