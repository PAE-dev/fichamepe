import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IServiceRepository } from '../../domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../services.di-tokens';

@Injectable()
export class DeleteServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.services.findById(id);
    if (!existing) {
      throw new NotFoundException('Servicio no encontrado');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('No puedes eliminar este servicio');
    }
    await this.services.delete(id);
  }
}
