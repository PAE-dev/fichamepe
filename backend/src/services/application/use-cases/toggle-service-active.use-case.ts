import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IServiceRepository } from '../../domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../services.di-tokens';
import {
  toServiceResponse,
  type ServiceResponse,
} from '../mappers/service-response.mapper';

@Injectable()
export class ToggleServiceActiveUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
  ) {}

  async execute(id: string, userId: string): Promise<ServiceResponse> {
    const existing = await this.services.findById(id);
    if (!existing) {
      throw new NotFoundException('Servicio no encontrado');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('No puedes modificar este servicio');
    }
    const updated = await this.services.update(id, {
      isActive: !existing.isActive,
    });
    if (!updated) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return toServiceResponse(updated);
  }
}
