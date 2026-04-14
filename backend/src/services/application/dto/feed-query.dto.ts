import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

function toTagArray(value: unknown): string[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const arr = Array.isArray(value) ? value : [value];
  const out = arr.filter(
    (v): v is string => typeof v === 'string' && v.trim().length > 0,
  );
  return out.length ? out.map((s) => s.trim()) : undefined;
}

export class FeedQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(40)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsIn(['recent', 'popular', 'random'])
  orderBy?: 'recent' | 'popular' | 'random';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @Transform(({ value }) => toTagArray(value))
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
