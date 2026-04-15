import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicationSlotPurchaseOrmEntity } from '../../infrastructure/persistence/entities/publication-slot-purchase.orm';

@Injectable()
export class ListMyPublicationSlotPurchasesUseCase {
  constructor(
    @InjectRepository(PublicationSlotPurchaseOrmEntity)
    private readonly purchases: Repository<PublicationSlotPurchaseOrmEntity>,
  ) {}

  execute(userId: string): Promise<PublicationSlotPurchaseOrmEntity[]> {
    return this.purchases
      .createQueryBuilder('p')
      .where('p.userId = :userId', { userId })
      .orderBy('p.createdAt', 'DESC')
      .getMany();
  }
}
