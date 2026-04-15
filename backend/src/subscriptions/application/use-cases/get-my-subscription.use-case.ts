import { Inject, Injectable } from '@nestjs/common';
import type { ISubscriptionRepository } from '../../domain/repositories/i-subscription.repository';
import { REPOSITORY_TOKEN } from '../../subscriptions.di-tokens';

@Injectable()
export class GetMySubscriptionUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN)
    private readonly subscriptions: ISubscriptionRepository,
  ) {}

  async execute(userId: string) {
    const active = await this.subscriptions.findActiveByUserId(userId);
    if (active) {
      return active;
    }
    return this.subscriptions.findLatestByUserId(userId);
  }
}
