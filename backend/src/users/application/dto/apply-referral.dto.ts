import { IsString, MaxLength, MinLength } from 'class-validator';

export class ApplyReferralBodyDto {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  code!: string;
}
