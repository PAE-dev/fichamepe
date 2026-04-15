import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProfileOrmEntity } from '../profiles/infrastructure/persistence/entities/profile.orm-entity';
import { ServiceOrmEntity } from '../services/infrastructure/persistence/entities/service.orm';
import { UserOrmEntity } from '../users/infrastructure/persistence/entities/user.orm-entity';
import { ChatGateway } from './chat.gateway';
import { ConversationMessageOrmEntity } from './infrastructure/persistence/entities/conversation-message.orm-entity';
import { ConversationOrmEntity } from './infrastructure/persistence/entities/conversation.orm-entity';

export type ConversationMessageApi = {
  id: string;
  senderUserId: string;
  text: string;
  createdAt: string;
};

export type ConversationThreadApi = {
  id: string;
  serviceId: string;
  sellerUserId: string;
  buyerUserId: string;
  participant: {
    id: string;
    fullName: string;
    initials: string;
    avatarUrl: string | null;
  };
  serviceTitle: string;
  serviceCoverImageUrl: string | null;
  servicePrice: number | null;
  servicePreviousPrice: number | null;
  serviceCategory: string | null;
  serviceDeliveryTime: string | null;
  unreadCount: number;
  messages: ConversationMessageApi[];
};

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(ConversationOrmEntity)
    private readonly conversationRepo: Repository<ConversationOrmEntity>,
    @InjectRepository(ConversationMessageOrmEntity)
    private readonly messageRepo: Repository<ConversationMessageOrmEntity>,
    @InjectRepository(ServiceOrmEntity)
    private readonly serviceRepo: Repository<ServiceOrmEntity>,
    @InjectRepository(ProfileOrmEntity)
    private readonly profileRepo: Repository<ProfileOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    private readonly chatGateway: ChatGateway,
  ) {}

  async listThreads(userId: string): Promise<ConversationThreadApi[]> {
    const threads = await this.conversationRepo.find({
      where: [{ sellerUserId: userId }, { buyerUserId: userId }],
      order: { updatedAt: 'DESC' },
    });
    if (!threads.length) return [];
    return this.mapThreadsForUser(userId, threads);
  }

  async createOrGetThread(
    buyerUserId: string,
    serviceId: string,
  ): Promise<ConversationThreadApi> {
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['owner'],
    });
    if (!service) {
      throw new NotFoundException('Publicación no encontrada');
    }
    if (service.status !== 'ACTIVA') {
      throw new BadRequestException('La publicación no está activa.');
    }
    const sellerUserId = service.owner.id;
    if (sellerUserId === buyerUserId) {
      throw new BadRequestException('No puedes conversar contigo mismo.');
    }

    let thread = await this.conversationRepo.findOne({
      where: { serviceId, buyerUserId },
    });
    if (!thread) {
      thread = this.conversationRepo.create({
        serviceId,
        sellerUserId,
        buyerUserId,
      });
      await this.conversationRepo.save(thread);
    }

    const mapped = await this.mapThreadsForUser(buyerUserId, [thread]);
    const first = mapped[0];
    if (!first) {
      throw new NotFoundException('No se pudo crear la conversación');
    }
    return first;
  }

  async getMessageHistory(
    userId: string,
    conversationId: string,
  ): Promise<{ messages: ConversationMessageApi[] }> {
    await this.assertParticipant(userId, conversationId);
    const rows = await this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'ASC' },
      take: 500,
    });
    return { messages: rows.map((m) => this.toMessageApi(m)) };
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    text: string,
  ): Promise<ConversationMessageApi> {
    await this.assertParticipant(userId, conversationId);
    const cleaned = text.trim();
    if (!cleaned) {
      throw new BadRequestException('El mensaje no puede estar vacío');
    }
    const entity = this.messageRepo.create({
      conversation: { id: conversationId },
      senderUserId: userId,
      body: cleaned,
    });
    const saved = await this.messageRepo.save(entity);
    await this.conversationRepo.update(
      { id: conversationId },
      { updatedAt: new Date() },
    );
    const api = this.toMessageApi(saved);
    this.chatGateway.emitNewMessage(conversationId, {
      conversationId,
      ...api,
    });
    return api;
  }

  private async assertParticipant(
    userId: string,
    conversationId: string,
  ): Promise<ConversationOrmEntity> {
    const row = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (!row) {
      throw new NotFoundException('Conversación no encontrada');
    }
    if (row.sellerUserId !== userId && row.buyerUserId !== userId) {
      throw new ForbiddenException('No perteneces a esta conversación');
    }
    return row;
  }

  private toMessageApi(m: ConversationMessageOrmEntity): ConversationMessageApi {
    return {
      id: m.id,
      senderUserId: m.senderUserId,
      text: m.body,
      createdAt: m.createdAt.toISOString(),
    };
  }

  private async mapThreadsForUser(
    userId: string,
    threads: ConversationOrmEntity[],
  ): Promise<ConversationThreadApi[]> {
    const serviceIds = [...new Set(threads.map((t) => t.serviceId))];
    const services = await this.serviceRepo.find({
      where: { id: In(serviceIds) },
    });
    const serviceMap = new Map(services.map((s) => [s.id, s]));

    const otherUserIds = threads.map((t) =>
      t.sellerUserId === userId ? t.buyerUserId : t.sellerUserId,
    );
    const uniqueOtherIds = [...new Set(otherUserIds)];
    const profiles = await this.profileRepo.find({
      where: { user: { id: In(uniqueOtherIds) } },
      relations: ['user'],
    });
    const profileByUserId = new Map(
      profiles.map((p) => [p.user.id, p] as const),
    );

    /** Siempre por id: evita "Usuario" si hay `profile` pero la relación `user` no vino en la query. */
    const counterpartUsers =
      uniqueOtherIds.length > 0
        ? await this.userRepo.find({
            where: { id: In(uniqueOtherIds) },
            select: ['id', 'fullName', 'email'],
          })
        : [];
    const userById = new Map(counterpartUsers.map((u) => [u.id, u]));

    const lastByConv = await this.loadLastMessagesByThreadIds(
      threads.map((t) => t.id),
    );

    return threads.map((t) => {
      const service = serviceMap.get(t.serviceId);
      if (!service) {
        throw new NotFoundException(`Servicio ${t.serviceId} no encontrado`);
      }
      const otherId = t.sellerUserId === userId ? t.buyerUserId : t.sellerUserId;
      const profile = profileByUserId.get(otherId);
      const otherUser = userById.get(otherId);
      const display = otherUser
        ? profile
          ? this.displayName(profile, otherUser)
          : this.displayNameFromUserOnly(otherUser)
        : 'Usuario';
      const last = lastByConv.get(t.id);
      const messages: ConversationMessageApi[] = last ? [this.toMessageApi(last)] : [];
      return {
        id: t.id,
        serviceId: t.serviceId,
        sellerUserId: t.sellerUserId,
        buyerUserId: t.buyerUserId,
        participant: {
          id: otherId,
          fullName: display,
          initials: this.initialsFromDisplay(display),
          avatarUrl: profile?.avatarUrl ?? null,
        },
        serviceTitle: service.title,
        serviceCoverImageUrl: service.coverImageUrl ?? null,
        servicePrice: service.price,
        servicePreviousPrice: service.listPrice,
        serviceCategory: service.category ?? null,
        serviceDeliveryTime: service.deliveryTime ?? null,
        unreadCount: 0,
        messages,
      };
    });
  }

  private async loadLastMessagesByThreadIds(
    conversationIds: string[],
  ): Promise<Map<string, ConversationMessageOrmEntity>> {
    const map = new Map<string, ConversationMessageOrmEntity>();
    await Promise.all(
      conversationIds.map(async (id) => {
        const row = await this.messageRepo.findOne({
          where: { conversation: { id } },
          order: { createdAt: 'DESC' },
        });
        if (row) map.set(id, row);
      }),
    );
    return map;
  }

  private displayName(profile: ProfileOrmEntity, user: UserOrmEntity): string {
    const fromProfile = profile.displayName?.trim();
    if (fromProfile) return fromProfile;
    return this.displayNameFromUserOnly(user);
  }

  /** Usuario sin fila en `profile` todavía (p. ej. cuenta recién creada). */
  private displayNameFromUserOnly(user: UserOrmEntity): string {
    const fromUser = user.fullName?.trim();
    if (fromUser) return fromUser;
    const email = user.email?.split('@')[0];
    return email ?? 'Usuario';
  }

  private initialsFromDisplay(name: string): string {
    const cleaned = name.trim();
    if (!cleaned) return 'US';
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`.toUpperCase();
    }
    return cleaned.slice(0, 2).toUpperCase();
  }
}
