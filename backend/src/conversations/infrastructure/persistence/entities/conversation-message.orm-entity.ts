import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConversationOrmEntity } from './conversation.orm-entity';

@Entity('conversation_message')
export class ConversationMessageOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ConversationOrmEntity, (c) => c.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation: ConversationOrmEntity;

  @Column({ type: 'uuid' })
  senderUserId: string;

  @Column({ type: 'text' })
  body: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
