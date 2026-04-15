import { IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  serviceId!: string;
}
