import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import type { ServiceReportReason } from '../../infrastructure/persistence/entities/service-report.orm';

const serviceReportReasons: ServiceReportReason[] = [
  'fraud',
  'inappropriate_content',
  'false_information',
  'spam',
  'other',
];

export class CreateServiceReportDto {
  @IsUUID('4')
  serviceId: string;

  @IsEnum(serviceReportReasons)
  reason: ServiceReportReason;

  @IsOptional()
  @IsString()
  @MaxLength(800)
  details?: string;
}
