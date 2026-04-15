import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicationSlotPurchaseOrmEntity } from '../../infrastructure/persistence/entities/publication-slot-purchase.orm';

function parseMoneyPen(raw: string | undefined, fallback: number): string {
  const n = Number(String(raw ?? '').trim());
  if (!Number.isFinite(n) || n < 0) {
    return fallback.toFixed(2);
  }
  return n.toFixed(2);
}

@Injectable()
export class CreatePendingPublicationSlotPurchaseUseCase {
  constructor(
    @InjectRepository(PublicationSlotPurchaseOrmEntity)
    private readonly purchases: Repository<PublicationSlotPurchaseOrmEntity>,
    private readonly config: ConfigService,
  ) {}

  async execute(params: {
    userId: string;
    kind: 'single' | 'pack3';
    paymentReference?: string | null;
  }): Promise<PublicationSlotPurchaseOrmEntity> {
    const singlePrice = parseMoneyPen(
      this.config.get<string>('PUBLICATION_SLOT_PRICE_PEN'),
      19,
    );
    const packPrice = parseMoneyPen(
      this.config.get<string>('PUBLICATION_PACK3_PRICE_PEN'),
      49,
    );
    const slotsGranted = params.kind === 'single' ? 1 : 3;
    const amountPen = params.kind === 'single' ? singlePrice : packPrice;
    const row = this.purchases.create({
      buyer: { id: params.userId } as { id: string },
      kind: params.kind,
      slotsGranted,
      amountPen,
      status: 'pending_payment',
      paymentReference: params.paymentReference?.trim() || null,
      fulfilledAt: null,
      fulfilledBy: null,
    });
    return this.purchases.save(row);
  }
}
