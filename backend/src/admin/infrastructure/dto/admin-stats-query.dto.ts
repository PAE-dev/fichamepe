import { IsIn, IsISO8601, IsOptional } from 'class-validator';

export class AdminStatsQueryDto {
  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;

  @IsOptional()
  @IsIn(['day', 'month', 'year'])
  bucket?: 'day' | 'month' | 'year';
}

