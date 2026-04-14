import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { UserRole } from '../../domain/entities';

export class UpdateUserBodyDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isPro?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  proExpiresAt?: Date | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  tokenBalance?: number;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
