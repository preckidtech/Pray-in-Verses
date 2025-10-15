import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateJournalDto {
  @IsString() @MinLength(1) title: string;
  @IsString() @MinLength(1) body: string;
  @IsOptional() @IsString() mood?: string;
}

export class UpdateJournalDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() body?: string;
  @IsOptional() @IsString() mood?: string;
}
