import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IServiceRepository } from '../../domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../services.di-tokens';
import type { Service } from '../../domain/entities/service.domain';
import type { UpdateServiceBodyDto } from '../dto/update-service.dto';
import {
  toServiceResponse,
  type ServiceResponse,
} from '../mappers/service-response.mapper';

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
    dto: UpdateServiceBodyDto,
  ): Promise<ServiceResponse> {
    const existing = await this.services.findById(id);
    if (!existing) {
      throw new NotFoundException('Servicio no encontrado');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('No puedes editar este servicio');
    }
    const patch: Partial<Service> = {};
    if (dto.title !== undefined) {
      patch.title = dto.title;
    }
    if (dto.description !== undefined) {
      patch.description = dto.description;
    }
    if (dto.price !== undefined) {
      patch.price = dto.price;
    }
    if (dto.coverImageUrl !== undefined) {
      patch.coverImageUrl = dto.coverImageUrl;
    }
    if (dto.isActive !== undefined) {
      patch.isActive = dto.isActive;
    }
    if (dto.tags !== undefined) {
      patch.tags = dto.tags;
    }
    const updated = await this.services.update(id, patch);
    if (!updated) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return toServiceResponse(updated);
  }
}
