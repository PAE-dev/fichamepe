import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SERVICE_REPOSITORY } from '../../../services/services.di-tokens';
import type { IServiceRepository } from '../../../services/domain/repositories/i-service.repository';
import { ServiceOrmEntity } from '../../../services/infrastructure/persistence/entities/service.orm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/entities/user.orm-entity';
import { CreateServiceReportDto } from '../dto/create-service-report.dto';
import { ServiceReportOrmEntity } from '../../infrastructure/persistence/entities/service-report.orm';

@Injectable()
export class CreateServiceReportUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
    @InjectRepository(ServiceReportOrmEntity)
    private readonly reportsRepo: Repository<ServiceReportOrmEntity>,
  ) {}

  async execute(
    reporterUserId: string,
    dto: CreateServiceReportDto,
  ): Promise<{ id: string }> {
    const service = await this.services.findById(dto.serviceId);
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const report = this.reportsRepo.create({
      service: { id: dto.serviceId } as ServiceOrmEntity,
      reporter: { id: reporterUserId } as UserOrmEntity,
      reason: dto.reason,
      details: dto.details?.trim() || null,
    });
    const saved = await this.reportsRepo.save(report);
    return { id: saved.id };
  }
}
