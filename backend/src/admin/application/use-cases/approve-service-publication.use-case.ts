import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IServiceRepository } from '../../../services/domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../../services/services.di-tokens';
import {
  toServiceResponse,
  type ServiceResponse,
} from '../../../services/application/mappers/service-response.mapper';

@Injectable()
export class ApproveServicePublicationUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
  ) {}

  async execute(id: string, adminUserId: string): Promise<ServiceResponse> {
    const existing = await this.services.findById(id);
    if (!existing) {
      throw new NotFoundException('Servicio no encontrado');
    }
    if (existing.status !== 'EN_REVISION') {
      throw new BadRequestException(
        'Solo puedes aprobar publicaciones en revisión',
      );
    }
    const updated = await this.services.update(id, {
      status: 'ACTIVA',
      reviewedAt: new Date(),
      reviewedByUserId: adminUserId,
      moderationComment: null,
    });
    if (!updated) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return toServiceResponse(updated);
  }
}
