import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IServiceRepository } from '../../domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../services.di-tokens';
import {
  toServiceResponse,
  type ServiceResponse,
} from '../mappers/service-response.mapper';
import { IncrementViewUseCase } from './increment-view.use-case';

@Injectable()
export class GetServiceByIdUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
    private readonly incrementView: IncrementViewUseCase,
  ) {}

  async execute(id: string): Promise<ServiceResponse> {
    const found = await this.services.findById(id);
    if (!found) {
      throw new NotFoundException('Servicio no encontrado');
    }
    await this.incrementView.execute(id);
    const updated = await this.services.findById(id);
    if (!updated) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return toServiceResponse(updated);
  }
}
