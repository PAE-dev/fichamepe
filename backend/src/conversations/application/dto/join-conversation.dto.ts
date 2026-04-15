import { IsUUID } from 'class-validator';

export class JoinConversationSocketDto {
  @IsUUID()
  conversationId!: string;
}
