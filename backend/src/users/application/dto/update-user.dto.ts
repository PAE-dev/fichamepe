import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
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

  /** ISO 3166-1 alpha-2 (p. ej. PE). Sincroniza con el país elegido en la app para el feed. */
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toUpperCase() : value,
  )
  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Z]{2}$/)
  countryCode?: string;
}
