import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository } from 'typeorm';
import { Service } from '../../../domain/entities/service.domain';
import type {
  IFindFeedServicesOptions,
  IServiceRepository,
} from '../../../domain/repositories/i-service.repository';
import { ProfileOrmEntity } from '../../../../profiles/infrastructure/persistence/entities/profile.orm-entity';
import { UserOrmEntity } from '../../../../users/infrastructure/persistence/entities/user.orm-entity';
import { ServiceOrmEntity } from '../entities/service.orm';

function tagsFromOrm(tags: string[] | null | undefined): string[] {
  if (!tags || !tags.length) {
    return [];
  }
  return tags;
}

function toDomain(row: ServiceOrmEntity, withProfile: boolean): Service {
  const s = new Service();
  s.id = row.id;
  s.title = row.title;
  s.description = row.description;
  s.price = row.price;
  s.currency = row.currency;
  s.coverImageUrl = row.coverImageUrl;
  s.isActive = row.isActive;
  s.viewCount = row.viewCount;
  s.tags = tagsFromOrm(row.tags);
  s.profileId = row.profile?.id ?? '';
  s.userId = row.owner?.id ?? '';
  s.createdAt = row.createdAt;
  s.updatedAt = row.updatedAt;
  if (withProfile && row.profile) {
    s.profileDisplayName = row.profile.displayName;
    s.profileAvatarUrl = row.profile.avatarUrl;
    s.profileIsAvailable = row.profile.isAvailable;
  }
  return s;
}

@Injectable()
export class ServiceTypeOrmRepository implements IServiceRepository {
  constructor(
    @InjectRepository(ServiceOrmEntity)
    private readonly repo: Repository<ServiceOrmEntity>,
  ) {}

  async findFeedServices(
    options: IFindFeedServicesOptions,
  ): Promise<{ services: Service[]; total: number }> {
    const baseQb = this.repo
      .createQueryBuilder('svc')
      .where('svc.isActive = :active', { active: true });

    const search = options.search?.trim();
    if (search) {
      const pattern = `%${search.toLowerCase()}%`;
      baseQb.andWhere(
        new Brackets((sub) => {
          sub
            .where('LOWER(svc.title) LIKE :search', { search: pattern })
            .orWhere('LOWER(svc.description) LIKE :search', {
              search: pattern,
            });
        }),
      );
    }

    if (options.tags?.length) {
      baseQb.andWhere(
        new Brackets((sub) => {
          options.tags!.forEach((tag, i) => {
            const key = `tagLike${i}`;
            sub.orWhere(`LOWER(svc.tags) LIKE :${key}`, {
              [key]: `%${tag.trim().toLowerCase()}%`,
            });
          });
        }),
      );
    }

    const total = await baseQb.clone().getCount();

    const idsQb = baseQb.clone().select('svc.id', 'id');
    if (options.orderBy === 'recent') {
      idsQb.orderBy('svc.createdAt', 'DESC');
    } else if (options.orderBy === 'popular') {
      idsQb.orderBy('svc.viewCount', 'DESC').addOrderBy(
        'svc.createdAt',
        'DESC',
      );
    } else {
      idsQb.orderBy('RANDOM()');
    }
    idsQb.skip(options.offset).take(options.limit);

    const rawIds = await idsQb.getRawMany<{ id: string }>();
    const ids = rawIds.map((r) => r.id);
    if (ids.length === 0) {
      return { services: [], total };
    }

    const rows = await this.repo.find({
      where: { id: In(ids) },
      relations: ['profile', 'owner'],
    });
    const byId = new Map(rows.map((r) => [r.id, r]));
    const orderedRows = ids
      .map((id) => byId.get(id))
      .filter((r): r is ServiceOrmEntity => r !== undefined);

    return {
      services: orderedRows.map((r) => toDomain(r, true)),
      total,
    };
  }

  async findByProfileId(profileId: string): Promise<Service[]> {
    const rows = await this.repo.find({
      where: {
        profile: { id: profileId },
        isActive: true,
      },
      relations: ['profile', 'owner'],
      order: { createdAt: 'DESC' },
    });
    return rows.map((r) => toDomain(r, true));
  }

  async findById(id: string): Promise<Service | null> {
    const row = await this.repo.findOne({
      where: { id },
      relations: ['profile', 'owner'],
    });
    return row ? toDomain(row, true) : null;
  }

  async findByIdsOrdered(ids: string[]): Promise<Service[]> {
    if (!ids.length) {
      return [];
    }
    const rows = await this.repo.find({
      where: { id: In(ids) },
      relations: ['profile', 'owner'],
    });
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((r): r is ServiceOrmEntity => r !== undefined)
      .map((r) => toDomain(r, true));
  }

  async create(data: Partial<Service>): Promise<Service> {
    const row = this.repo.create({
      title: data.title!,
      description: data.description!,
      price: data.price ?? null,
      currency: data.currency ?? 'PEN',
      coverImageUrl: data.coverImageUrl ?? null,
      isActive: data.isActive ?? true,
      viewCount: data.viewCount ?? 0,
      tags: data.tags?.length ? data.tags : [],
      profile: { id: data.profileId } as ProfileOrmEntity,
      owner: { id: data.userId } as UserOrmEntity,
    });
    const saved = await this.repo.save(row);
    const withRels = await this.repo.findOne({
      where: { id: saved.id },
      relations: ['profile', 'owner'],
    });
    return toDomain(withRels!, true);
  }

  async update(id: string, data: Partial<Service>): Promise<Service | null> {
    const row = await this.repo.findOne({
      where: { id },
      relations: ['profile', 'owner'],
    });
    if (!row) {
      return null;
    }
    if (data.title !== undefined) {
      row.title = data.title;
    }
    if (data.description !== undefined) {
      row.description = data.description;
    }
    if (data.price !== undefined) {
      row.price = data.price;
    }
    if (data.currency !== undefined) {
      row.currency = data.currency;
    }
    if (data.coverImageUrl !== undefined) {
      row.coverImageUrl = data.coverImageUrl;
    }
    if (data.isActive !== undefined) {
      row.isActive = data.isActive;
    }
    if (data.tags !== undefined) {
      row.tags = data.tags;
    }
    await this.repo.save(row);
    const reloaded = await this.repo.findOne({
      where: { id },
      relations: ['profile', 'owner'],
    });
    return reloaded ? toDomain(reloaded, true) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.repo.increment({ id }, 'viewCount', 1);
  }

  async countByProfileId(profileId: string): Promise<number> {
    return this.repo.count({
      where: { profile: { id: profileId } },
    });
  }
}
