import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IServiceRepository } from '../../../services/domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../../services/services.di-tokens';
import { ProfileOrmEntity } from '../../../profiles/infrastructure/persistence/entities/profile.orm-entity';
import { ServiceReviewOrmEntity } from '../../infrastructure/persistence/entities/service-review.orm-entity';
import {
  serviceReviewToPublicDto,
  type ServiceReviewPublicDto,
} from '../mappers/service-review-public.mapper';

@Injectable()
export class GetMyServiceReviewUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
    @InjectRepository(ServiceReviewOrmEntity)
    private readonly reviews: Repository<ServiceReviewOrmEntity>,
    @InjectRepository(ProfileOrmEntity)
    private readonly profiles: Repository<ProfileOrmEntity>,
  ) {}

  async execute(
    serviceId: string,
    userId: string,
  ): Promise<{ review: ServiceReviewPublicDto | null }> {
    const service = await this.services.findActiveById(serviceId);
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const row = await this.reviews.findOne({
      where: { service: { id: serviceId }, author: { id: userId } },
      relations: ['author'],
    });
    if (!row) {
      return { review: null };
    }

    const profile = await this.profiles.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return {
      review: serviceReviewToPublicDto(
        row,
        profile ?? undefined,
        serviceId,
        service.title,
      ),
    };
  }
}
