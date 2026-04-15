import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/entities/user.orm-entity';
import { ServiceOrmEntity } from '../../../services/infrastructure/persistence/entities/service.orm';
import { UserPresenceOrmEntity } from '../../../presence/infrastructure/persistence/entities/user-presence.orm';

type Bucket = 'day' | 'month' | 'year';

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function isoMonth(d: Date): string {
  return d.toISOString().slice(0, 7);
}
function isoYear(d: Date): string {
  return d.toISOString().slice(0, 4);
}

@Injectable()
export class AdminStatsService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(ServiceOrmEntity)
    private readonly services: Repository<ServiceOrmEntity>,
    @InjectRepository(UserPresenceOrmEntity)
    private readonly presence: Repository<UserPresenceOrmEntity>,
  ) {}

  private bucketKey(bucket: Bucket, d: Date): string {
    if (bucket === 'year') return isoYear(d);
    if (bucket === 'month') return isoMonth(d);
    return isoDay(d);
  }

  private async seriesByCreatedAt<T extends { createdAt: Date }>(
    repo: Repository<T>,
    bucket: Bucket,
    from: Date,
    to: Date,
  ): Promise<Array<{ bucket: string; count: number }>> {
    const rows = await repo
      .createQueryBuilder('t')
      .select(['t.createdAt'])
      .where('t.createdAt >= :from AND t.createdAt <= :to', { from, to })
      .getMany();

    const map = new Map<string, number>();
    for (const r of rows) {
      const key = this.bucketKey(bucket, new Date(r.createdAt));
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([bucketKeyStr, count]) => ({ bucket: bucketKeyStr, count }));
  }

  async getOverview(params: {
    bucket: Bucket;
    from: Date;
    to: Date;
    onlineWindowMinutes: number;
  }) {
    const [usersTotal, servicesTotal] = await Promise.all([
      this.users.count(),
      this.services.count(),
    ]);

    const threshold = new Date(Date.now() - params.onlineWindowMinutes * 60_000);
    const onlineNow = await this.presence
      .createQueryBuilder('p')
      .where('p.lastSeenAt >= :threshold', { threshold })
      .getCount();

    const [usersSeries, servicesSeries] = await Promise.all([
      this.seriesByCreatedAt(this.users as unknown as Repository<{ createdAt: Date }>, params.bucket, params.from, params.to),
      this.seriesByCreatedAt(this.services as unknown as Repository<{ createdAt: Date }>, params.bucket, params.from, params.to),
    ]);

    const newUsers = await this.users
      .createQueryBuilder('u')
      .where('u.createdAt >= :from AND u.createdAt <= :to', {
        from: params.from,
        to: params.to,
      })
      .getCount();

    const newServices = await this.services
      .createQueryBuilder('s')
      .where('s.createdAt >= :from AND s.createdAt <= :to', {
        from: params.from,
        to: params.to,
      })
      .getCount();

    const inReview = await this.services
      .createQueryBuilder('s')
      .where('s.status = :status', { status: 'EN_REVISION' })
      .getCount();

    return {
      usersTotal,
      servicesTotal,
      onlineNow,
      inReview,
      range: { from: params.from.toISOString(), to: params.to.toISOString(), bucket: params.bucket },
      newUsers,
      newServices,
      series: {
        users: usersSeries,
        services: servicesSeries,
      },
    };
  }
}

