import { Inject, Injectable } from '@nestjs/common';
import type { IServiceRepository } from '../../../services/domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../../services/services.di-tokens';
import {
  toServiceResponse,
  type ServiceResponse,
} from '../../../services/application/mappers/service-response.mapper';

@Injectable()
export class ListReviewQueueUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
  ) {}

  async execute(): Promise<{ services: ServiceResponse[] }> {
    const list = await this.services.findReviewQueue();
    return { services: list.map((item) => toServiceResponse(item)) };
  }
}
