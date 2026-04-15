import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IUserRepository } from '../../../users/domain/repositories';
import { USER_REPOSITORY } from '../../../users/users.di-tokens';
import { PublicationSlotPurchaseOrmEntity } from '../../infrastructure/persistence/entities/publication-slot-purchase.orm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/entities/user.orm-entity';

@Injectable()
export class FulfillPublicationSlotPurchaseUseCase {
  constructor(
    @InjectRepository(PublicationSlotPurchaseOrmEntity)
    private readonly purchases: Repository<PublicationSlotPurchaseOrmEntity>,
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
  ) {}

  async execute(params: {
    purchaseId: string;
    adminUserId: string;
  }): Promise<PublicationSlotPurchaseOrmEntity> {
    const row = await this.purchases.findOne({
      where: { id: params.purchaseId },
      relations: ['buyer'],
    });
    if (!row) {
      throw new NotFoundException('Orden no encontrada');
    }
    if (row.status !== 'pending_payment') {
      throw new BadRequestException(
        'Solo se pueden cumplir órdenes en pending_payment',
      );
    }
    const buyerId = row.buyer.id;
    await this.users.incrementPurchasedPublicationSlots(
      buyerId,
      row.slotsGranted,
    );
    row.status = 'fulfilled';
    row.fulfilledAt = new Date();
    row.fulfilledBy = { id: params.adminUserId } as unknown as UserOrmEntity;
    return this.purchases.save(row);
  }
}
