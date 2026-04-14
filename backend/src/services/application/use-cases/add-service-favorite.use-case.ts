import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IServiceRepository } from '../../domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../services.di-tokens';
import { ServiceFavoriteOrmEntity } from '../../infrastructure/persistence/entities/service-favorite.orm';
import { ServiceOrmEntity } from '../../infrastructure/persistence/entities/service.orm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/entities/user.orm-entity';

@Injectable()
export class AddServiceFavoriteUseCase {
  constructor(
    @InjectRepository(ServiceFavoriteOrmEntity)
    private readonly favorites: Repository<ServiceFavoriteOrmEntity>,
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
  ) {}

  async execute(userId: string, serviceId: string): Promise<{ ok: true }> {
    const svc = await this.services.findById(serviceId);
    if (!svc || !svc.isActive) {
      throw new NotFoundException('Servicio no encontrado');
    }
    const exists = await this.favorites.exist({
      where: {
        user: { id: userId },
        service: { id: serviceId },
      },
    });
    if (exists) {
      return { ok: true as const };
    }
    await this.favorites.save(
      this.favorites.create({
        user: { id: userId } as UserOrmEntity,
        service: { id: serviceId } as ServiceOrmEntity,
      }),
    );
    return { ok: true as const };
  }
}
