import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import type { RequestUser } from '../../../auth/domain/services/auth-token.service.interface';
import { CreateServiceReportDto } from '../../application/dto/create-service-report.dto';
import { CreateServiceReportUseCase } from '../../application/use-cases/create-service-report.use-case';

@Controller('service-reports')
@UseGuards(JwtAuthGuard)
export class ServiceReportsController {
  constructor(private readonly createReport: CreateServiceReportUseCase) {}

  @Post()
  create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreateServiceReportDto,
  ) {
    return this.createReport.execute(user.userId, body);
  }
}
