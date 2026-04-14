import { ProfileOrmEntity } from '../../../../profiles/infrastructure/persistence/entities/profile.orm-entity';
import { UserOrmEntity } from '../../../../users/infrastructure/persistence/entities/user.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

const priceNumberTransformer = {
  to: (value: number | null | undefined) => value ?? null,
  from: (value: string | null): number | null =>
    value === null || value === undefined ? null : Number(value),
};

@Entity('service')
@Index(['isActive'])
@Index(['viewCount'])
@Index(['createdAt'])
export class ServiceOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  title: string;

  @Column({ type: 'varchar', length: 280 })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: priceNumberTransformer,
  })
  price: number | null;

  @Column({ type: 'varchar', length: 3, default: 'PEN' })
  currency: 'PEN';

  @Column({ type: 'varchar', nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[] | null;

  @ManyToOne(() => ProfileOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profileId' })
  profile: ProfileOrmEntity;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  owner: UserOrmEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
