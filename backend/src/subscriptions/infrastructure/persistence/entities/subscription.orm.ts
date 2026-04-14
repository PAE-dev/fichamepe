import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserOrmEntity } from '../../../../users/infrastructure/persistence/entities/user.orm-entity';
import {
  SubscriptionPlan,
  SubscriptionStatus,
} from '../../../domain/entities/subscription.domain';

@Entity('subscriptions')
export class SubscriptionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @Column({
    type: 'varchar',
    length: 32,
  })
  plan: SubscriptionPlan;

  @Column({
    type: 'varchar',
    length: 32,
  })
  status: SubscriptionStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: string;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod: string | null;

  @Column({ type: 'varchar', nullable: true })
  paymentReference: string | null;

  @Column({ type: 'timestamp', nullable: true })
  activatedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'varchar', nullable: true })
  activatedBy: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
