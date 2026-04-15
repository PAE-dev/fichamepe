import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPresenceOrmEntity } from './infrastructure/persistence/entities/user-presence.orm';

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(UserPresenceOrmEntity)
    private readonly repo: Repository<UserPresenceOrmEntity>,
  ) {}

  async heartbeat(params: {
    userId: string;
    ip: string;
    userAgent: string;
    at: Date;
  }): Promise<void> {
    await this.repo.upsert(
      {
        userId: params.userId,
        ip: params.ip,
        userAgent: params.userAgent,
        lastSeenAt: params.at,
        updatedAt: params.at,
      },
      ['userId'],
    );
  }
}

