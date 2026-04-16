import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class VerifyEmailBodyDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  token!: string;
}
