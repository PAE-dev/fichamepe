import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateServiceBodyDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(80)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(280)
  description?: string;

  @IsOptional()
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number | null;

  @IsOptional()
  @ValidateIf((_, v) => v !== null && v !== undefined && v !== '')
  @IsString()
  @MaxLength(2048)
  coverImageUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  tags?: string[];
}
