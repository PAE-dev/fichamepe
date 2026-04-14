import { Inject, Injectable } from '@nestjs/common';
import type { IServiceRepository } from '../../domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../services.di-tokens';
import {
  toServiceResponse,
  type ServiceResponse,
} from '../mappers/service-response.mapper';

@Injectable()
export class GetServicesByProfileUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
  ) {}

  async execute(profileId: string): Promise<{ services: ServiceResponse[] }> {
    const list = await this.services.findByProfileId(profileId);
    return { services: list.map(toServiceResponse) };
  }
}
