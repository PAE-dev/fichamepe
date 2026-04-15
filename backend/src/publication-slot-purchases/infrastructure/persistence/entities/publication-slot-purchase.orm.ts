import { UserOrmEntity } from '../../../../users/infrastructure/persistence/entities/user.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type PublicationSlotPurchaseKind = 'single' | 'pack3';

export type PublicationSlotPurchaseStatus =
  | 'pending_payment'
  | 'fulfilled'
  | 'cancelled';

@Entity('publication_slot_purchase')
export class PublicationSlotPurchaseOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  buyer: UserOrmEntity;

  @Column({ type: 'varchar', length: 16 })
  kind: PublicationSlotPurchaseKind;

  @Column({ type: 'int' })
  slotsGranted: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountPen: string;

  @Column({ type: 'varchar', length: 24, default: 'pending_payment' })
  status: PublicationSlotPurchaseStatus;

  @Column({ type: 'varchar', nullable: true })
  paymentReference: string | null;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'fulfilledByUserId' })
  fulfilledBy: UserOrmEntity | null;

  @Column({ type: 'timestamp', nullable: true })
  fulfilledAt: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
