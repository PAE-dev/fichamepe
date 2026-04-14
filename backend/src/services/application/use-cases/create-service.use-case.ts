import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IProfileRepository } from '../../../profiles/domain/repositories/profile.repository.interface';
import { PROFILE_REPOSITORY } from '../../../profiles/profiles.di-tokens';
import type { IServiceRepository } from '../../domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../services.di-tokens';
import type { CreateServiceBodyDto } from '../dto/create-service.dto';
import {
  toServiceResponse,
  type ServiceResponse,
} from '../mappers/service-response.mapper';

const MAX_SERVICES_PER_PROFILE = 10;

@Injectable()
export class CreateServiceUseCase {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profiles: IProfileRepository,
  ) {}

  async execute(
    userId: string,
    dto: CreateServiceBodyDto,
  ): Promise<ServiceResponse> {
    const profile = await this.profiles.findByUserId(userId);
    if (!profile) {
      throw new BadRequestException(
        'Necesitas un perfil publicado antes de crear un servicio',
      );
    }
    const count = await this.services.countByProfileId(profile.id);
    if (count >= MAX_SERVICES_PER_PROFILE) {
      throw new BadRequestException(
        `Solo puedes tener hasta ${MAX_SERVICES_PER_PROFILE} servicios activos o guardados`,
      );
    }
    const created = await this.services.create({
      title: dto.title,
      description: dto.description,
      price: dto.price ?? null,
      currency: 'PEN',
      coverImageUrl: dto.coverImageUrl ?? null,
      isActive: true,
      tags: dto.tags ?? [],
      profileId: profile.id,
      userId,
    });
    return toServiceResponse(created);
  }
}
