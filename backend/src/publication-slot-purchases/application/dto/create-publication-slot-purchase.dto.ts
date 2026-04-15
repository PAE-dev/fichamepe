import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePublicationSlotPurchaseBodyDto {
  @IsIn(['single', 'pack3'])
  kind!: 'single' | 'pack3';

  @IsOptional()
  @IsString()
  @MaxLength(255)
  paymentReference?: string;
}
