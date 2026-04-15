import { ServiceOrmEntity } from '../../../../services/infrastructure/persistence/entities/service.orm';
import { UserOrmEntity } from '../../../../users/infrastructure/persistence/entities/user.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type ServiceReportReason =
  | 'fraud'
  | 'inappropriate_content'
  | 'false_information'
  | 'spam'
  | 'other';

@Entity('service_report')
@Index(['service'])
@Index(['reporter'])
@Index(['createdAt'])
export class ServiceReportOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceOrmEntity;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporterUserId' })
  reporter: UserOrmEntity;

  @Column({ type: 'varchar', length: 40 })
  reason: ServiceReportReason;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  details: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
