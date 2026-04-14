import { Inject, Injectable } from '@nestjs/common';
import type { IServiceRepository } from '../../domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../services.di-tokens';

@Injectable()
export class IncrementViewUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.services.incrementViewCount(id);
  }
}
