import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserOrmEntity } from '../../../users/infrastructure/persistence/entities/user.orm-entity';
import { ProfileOrmEntity } from '../../../profiles/infrastructure/persistence/entities/profile.orm-entity';
import { AuthLoginEventOrmEntity } from '../../../auth/infrastructure/persistence/entities/auth-login-event.orm';
import { UserPresenceOrmEntity } from '../../../presence/infrastructure/persistence/entities/user-presence.orm';
import type { UserRole } from '../../../users/domain/entities/user';

type AdminUserRow = {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  profile: {
    displayName: string;
    avatarUrl: string | null;
  } | null;
  lastLogin: {
    at: Date;
    ip: string;
    userAgent: string;
  } | null;
  presence: {
    lastSeenAt: Date;
    ip: string;
    userAgent: string;
  } | null;
};

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly users: Repository<UserOrmEntity>,
    @InjectRepository(ProfileOrmEntity)
    private readonly profiles: Repository<ProfileOrmEntity>,
    @InjectRepository(AuthLoginEventOrmEntity)
    private readonly logins: Repository<AuthLoginEventOrmEntity>,
    @InjectRepository(UserPresenceOrmEntity)
    private readonly presence: Repository<UserPresenceOrmEntity>,
  ) {}

  async list(params: {
    search?: string;
    role?: UserRole;
    offset: number;
    limit: number;
  }): Promise<{ total: number; items: AdminUserRow[] }> {
    const qb = this.users.createQueryBuilder('u');

    if (params.role) {
      qb.andWhere('u.role = :role', { role: params.role });
    }
    if (params.search && params.search.trim()) {
      const q = `%${params.search.trim().toLowerCase()}%`;
      qb.andWhere('(LOWER(u.email) LIKE :q OR LOWER(u.fullName) LIKE :q)', { q });
    }

    qb.orderBy('u.createdAt', 'DESC').skip(params.offset).take(params.limit);

    const [rows, total] = await qb.getManyAndCount();
    const userIds = rows.map((r) => r.id);

    const [profiles, lastLogins, presences] = await Promise.all([
      userIds.length
        ? this.profiles
            .createQueryBuilder('p')
            .leftJoin('p.user', 'u')
            .where('u.id IN (:...ids)', { ids: userIds })
            .select(['p.id', 'p.displayName', 'p.avatarUrl', 'u.id'])
            .getMany()
        : Promise.resolve([]),
      userIds.length
        ? this.logins
            .createQueryBuilder('e')
            .where('e.userId IN (:...ids)', { ids: userIds })
            .orderBy('e.createdAt', 'DESC')
            .getMany()
        : Promise.resolve([]),
      userIds.length ? this.presence.find({ where: { userId: In(userIds) } }) : Promise.resolve([]),
    ]);

    const profileByUserId = new Map<string, ProfileOrmEntity>();
    for (const p of profiles) {
      const uid = (p as unknown as { user?: { id?: string } }).user?.id;
      if (uid) profileByUserId.set(uid, p);
    }

    const lastLoginByUserId = new Map<string, AuthLoginEventOrmEntity>();
    for (const e of lastLogins) {
      if (!lastLoginByUserId.has(e.userId)) {
        lastLoginByUserId.set(e.userId, e);
      }
    }

    const presenceByUserId = new Map<string, UserPresenceOrmEntity>();
    for (const p of presences) presenceByUserId.set(p.userId, p);

    const items: AdminUserRow[] = rows.map((u) => {
      const p = profileByUserId.get(u.id);
      const e = lastLoginByUserId.get(u.id);
      const pr = presenceByUserId.get(u.id);
      return {
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        profile: p
          ? {
              displayName: p.displayName,
              avatarUrl: p.avatarUrl,
            }
          : null,
        lastLogin: e
          ? {
              at: e.createdAt,
              ip: e.ip,
              userAgent: e.userAgent,
            }
          : null,
        presence: pr
          ? {
              lastSeenAt: pr.lastSeenAt,
              ip: pr.ip,
              userAgent: pr.userAgent,
            }
          : null,
      };
    });

    return { total, items };
  }
}

