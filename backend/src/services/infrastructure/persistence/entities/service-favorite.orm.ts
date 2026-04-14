import { UserOrmEntity } from '../../../../users/infrastructure/persistence/entities/user.orm-entity';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ServiceOrmEntity } from './service.orm';

@Entity('service_favorite')
@Unique(['user', 'service'])
@Index(['user'])
@Index(['service'])
export class ServiceFavoriteOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @ManyToOne(() => ServiceOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceOrmEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
