import { UserOrmEntity } from '../../../../users/infrastructure/persistence/entities/user.orm-entity';
import { ServiceOrmEntity } from '../../../../services/infrastructure/persistence/entities/service.orm';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('service_review')
@Unique('UQ_service_review_service_author', ['service', 'author'])
export class ServiceReviewOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceOrmEntity;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorUserId' })
  author: UserOrmEntity;

  @Column({ type: 'smallint' })
  rating: number;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'boolean', default: false })
  isVerifiedPurchase: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
