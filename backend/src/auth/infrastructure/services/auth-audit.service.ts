import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLoginEventOrmEntity } from '../persistence/entities/auth-login-event.orm';

@Injectable()
export class AuthAuditService {
  constructor(
    @InjectRepository(AuthLoginEventOrmEntity)
    private readonly repo: Repository<AuthLoginEventOrmEntity>,
  ) {}

  async recordLoginEvent(params: {
    userId: string;
    ip: string;
    userAgent: string;
  }): Promise<void> {
    await this.repo.insert({
      userId: params.userId,
      ip: params.ip,
      userAgent: params.userAgent,
    });
  }
}

