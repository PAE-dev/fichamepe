import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConversationMessageOrmEntity } from './conversation-message.orm-entity';

@Entity('conversation')
export class ConversationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  serviceId: string;

  @Column({ type: 'uuid' })
  sellerUserId: string;

  @Column({ type: 'uuid' })
  buyerUserId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => ConversationMessageOrmEntity, (m) => m.conversation)
  messages: ConversationMessageOrmEntity[];
}
