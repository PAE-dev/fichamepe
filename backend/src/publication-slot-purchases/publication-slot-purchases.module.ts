import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PublicationSlotPurchaseOrmEntity } from './infrastructure/persistence/entities/publication-slot-purchase.orm';
import { PublicationSlotPurchasesController } from './infrastructure/controllers/publication-slot-purchases.controller';
import { CreatePendingPublicationSlotPurchaseUseCase } from './application/use-cases/create-pending-publication-slot-purchase.use-case';
import { FulfillPublicationSlotPurchaseUseCase } from './application/use-cases/fulfill-publication-slot-purchase.use-case';
import { ListMyPublicationSlotPurchasesUseCase } from './application/use-cases/list-my-publication-slot-purchases.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicationSlotPurchaseOrmEntity]),
    AuthModule,
    UsersModule,
  ],
  controllers: [PublicationSlotPurchasesController],
  providers: [
    CreatePendingPublicationSlotPurchaseUseCase,
    FulfillPublicationSlotPurchaseUseCase,
    ListMyPublicationSlotPurchasesUseCase,
  ],
})
export class PublicationSlotPurchasesModule {}
