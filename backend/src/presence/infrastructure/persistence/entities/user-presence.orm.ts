import { UserOrmEntity } from '../../../../users/infrastructure/persistence/entities/user.orm-entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('user_presence')
@Index(['lastSeenAt'])
export class UserPresenceOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @OneToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserOrmEntity;

  @Column({ type: 'varchar', length: 64 })
  ip: string;

  @Column({ type: 'text' })
  userAgent: string;

  @Column({ type: 'timestamptz' })
  lastSeenAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}

