import { IsArray, IsInt, IsOptional, IsString, Min, MinLength, ArrayNotEmpty, IsIn } from 'class-validator';

export class CreateCuratedPrayerDto {
  @IsString() @MinLength(1) book: string;
  @IsInt() @Min(1) chapter: number;
  @IsInt() @Min(1) verse: number;
  @IsString() @MinLength(1) theme: string;
  @IsString() @MinLength(1) scriptureText: string;
  @IsString() @MinLength(1) insight: string;
  @IsArray() @ArrayNotEmpty() @IsString({each:true}) prayerPoints: string[];
  @IsString() @MinLength(1) closing: string;
}

export class UpdateCuratedPrayerDto {
  @IsOptional() @IsString() book?: string;
  @IsOptional() @IsInt() @Min(1) chapter?: number;
  @IsOptional() @IsInt() @Min(1) verse?: number;
  @IsOptional() @IsString() @MinLength(1) theme?: string;
  @IsOptional() @IsString() @MinLength(1) scriptureText?: string;
  @IsOptional() @IsString() @MinLength(1) insight?: string;
  @IsOptional() @IsArray() @IsString({each:true}) prayerPoints?: string[];
  @IsOptional() @IsString() @MinLength(1) closing?: string;
}

export class ListQuery {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() state?: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  @IsOptional() @IsString() book?: string;
  @IsOptional() @IsString() cursor?: string;
  @IsOptional() @IsInt() @Min(1) limit?: number;
}

export class TransitionDto {
  @IsString() @IsIn(['REVIEW','PUBLISHED','ARCHIVED']) target: 'REVIEW'|'PUBLISHED'|'ARCHIVED';
}
