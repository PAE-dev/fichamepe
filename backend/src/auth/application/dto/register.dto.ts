import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../users/domain/entities/user';

export class RegisterDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  fullName?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  /** Código de referido (opcional). Normalizado en backend (mayúsculas). */
  @IsOptional()
  @IsString()
  referralCode?: string;
}
