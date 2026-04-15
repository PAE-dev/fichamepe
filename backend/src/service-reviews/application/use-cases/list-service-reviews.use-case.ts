import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { IServiceRepository } from '../../../services/domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../../services/services.di-tokens';
import { ProfileOrmEntity } from '../../../profiles/infrastructure/persistence/entities/profile.orm-entity';
import { ServiceReviewOrmEntity } from '../../infrastructure/persistence/entities/service-review.orm-entity';
import { serviceReviewToPublicDto } from '../mappers/service-review-public.mapper';
import type { ServiceReviewPublicDto } from '../mappers/service-review-public.mapper';

@Injectable()
export class ListServiceReviewsUseCase {
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
    limit: number,
    offset: number,
  ): Promise<{
    items: ServiceReviewPublicDto[];
    total: number;
    verifiedInPage: number;
  }> {
    const service = await this.services.findActiveById(serviceId);
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }

    const [rows, total] = await this.reviews.findAndCount({
      where: { service: { id: serviceId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    const userIds = [...new Set(rows.map((r) => r.author.id))];
    const profileRows =
      userIds.length > 0
        ? await this.profiles.find({
            where: { user: { id: In(userIds) } },
            relations: ['user'],
          })
        : [];
    const profileByUserId = new Map(
      profileRows.map((p) => [p.user.id, p] as const),
    );

    const items = rows.map((r) =>
      serviceReviewToPublicDto(
        r,
        profileByUserId.get(r.author.id),
        serviceId,
        service.title,
      ),
    );

    const verifiedInPage = rows.filter((r) => r.isVerifiedPurchase).length;

    return { items, total, verifiedInPage };
  }
}
