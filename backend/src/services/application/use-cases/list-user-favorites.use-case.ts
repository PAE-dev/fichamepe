import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IServiceRepository } from '../../domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../services.di-tokens';
import {
  toServiceResponse,
  type ServiceResponse,
} from '../mappers/service-response.mapper';
import { ServiceFavoriteOrmEntity } from '../../infrastructure/persistence/entities/service-favorite.orm';

@Injectable()
export class ListUserFavoritesUseCase {
  constructor(
    @InjectRepository(ServiceFavoriteOrmEntity)
    private readonly favorites: Repository<ServiceFavoriteOrmEntity>,
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
  ) {}

  async execute(userId: string): Promise<{ services: ServiceResponse[] }> {
    const raw = await this.favorites
      .createQueryBuilder('f')
      .select('f.serviceId', 'serviceId')
      .where('f.userId = :userId', { userId })
      .orderBy('f.createdAt', 'DESC')
      .getRawMany<{ serviceId: string }>();
    const ids = raw.map((r) => r.serviceId);
    if (!ids.length) {
      return { services: [] };
    }
    const domain = await this.services.findByIdsOrdered(ids);
    return { services: domain.map((s) => toServiceResponse(s)) };
  }
}
