import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceFavoriteOrmEntity } from '../../infrastructure/persistence/entities/service-favorite.orm';

@Injectable()
export class RemoveServiceFavoriteUseCase {
  constructor(
    @InjectRepository(ServiceFavoriteOrmEntity)
    private readonly favorites: Repository<ServiceFavoriteOrmEntity>,
  ) {}

  async execute(userId: string, serviceId: string): Promise<{ ok: true }> {
    const row = await this.favorites.findOne({
      where: {
        user: { id: userId },
        service: { id: serviceId },
      },
    });
    if (row) {
      await this.favorites.remove(row);
    }
    return { ok: true as const };
  }
}
