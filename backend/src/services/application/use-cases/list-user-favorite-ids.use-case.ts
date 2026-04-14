import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceFavoriteOrmEntity } from '../../infrastructure/persistence/entities/service-favorite.orm';

@Injectable()
export class ListUserFavoriteIdsUseCase {
  constructor(
    @InjectRepository(ServiceFavoriteOrmEntity)
    private readonly favorites: Repository<ServiceFavoriteOrmEntity>,
  ) {}

  async execute(userId: string): Promise<{ ids: string[] }> {
    const raw = await this.favorites
      .createQueryBuilder('f')
      .select('f.serviceId', 'serviceId')
      .where('f.userId = :userId', { userId })
      .orderBy('f.createdAt', 'DESC')
      .getRawMany<{ serviceId: string }>();
    return { ids: raw.map((r) => r.serviceId) };
  }
}
