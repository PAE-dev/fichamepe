import type { Service } from '../entities/service.domain';

export type FeedOrderBy = 'recent' | 'popular' | 'random';

export interface IFindFeedServicesOptions {
  limit: number;
  offset: number;
  orderBy: FeedOrderBy;
  tags?: string[];
  search?: string;
}

export interface IServiceRepository {
  findFeedServices(
    options: IFindFeedServicesOptions,
  ): Promise<{ services: Service[]; total: number }>;

  findByProfileId(profileId: string): Promise<Service[]>;

  findById(id: string): Promise<Service | null>;

  /** Misma forma que `findById` con perfil; respeta el orden de `ids`. Omite ids sin fila. */
  findByIdsOrdered(ids: string[]): Promise<Service[]>;

  create(service: Partial<Service>): Promise<Service>;

  update(id: string, data: Partial<Service>): Promise<Service | null>;

  delete(id: string): Promise<void>;

  incrementViewCount(id: string): Promise<void>;

  countByProfileId(profileId: string): Promise<number>;
}
