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
export class RequestServiceChangesUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
  ) {}

  async execute(
    id: string,
    adminUserId: string,
    comment: string,
  ): Promise<ServiceResponse> {
    const feedback = comment.trim();
    if (!feedback) {
      throw new BadRequestException(
        'Debes indicar el comentario para solicitar cambios',
      );
    }
    const existing = await this.services.findById(id);
    if (!existing) {
      throw new NotFoundException('Servicio no encontrado');
    }
    if (existing.status !== 'EN_REVISION') {
      throw new BadRequestException(
        'Solo puedes solicitar cambios a publicaciones en revisión',
      );
    }
    const updated = await this.services.update(id, {
      status: 'REQUIERE_CAMBIOS',
      moderationComment: feedback,
      reviewedAt: new Date(),
      reviewedByUserId: adminUserId,
    });
    if (!updated) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return toServiceResponse(updated);
  }
}
