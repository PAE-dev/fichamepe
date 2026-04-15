import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ServicesModule } from '../services/services.module';
import { CreateServiceReportUseCase } from './application/use-cases/create-service-report.use-case';
import { ServiceReportsController } from './infrastructure/controllers/service-reports.controller';
import { ServiceReportOrmEntity } from './infrastructure/persistence/entities/service-report.orm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceReportOrmEntity]),
    AuthModule,
    ServicesModule,
  ],
  controllers: [ServiceReportsController],
  providers: [CreateServiceReportUseCase],
})
export class ServiceReportsModule {}
