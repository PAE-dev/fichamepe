import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IProfileRepository } from '../../../profiles/domain/repositories';
import { PROFILE_REPOSITORY } from '../../../profiles/profiles.di-tokens';
import type { SafeUser } from '../../../users/domain/entities';
import type { IUserRepository } from '../../../users/domain/repositories';
import { USER_REPOSITORY } from '../../../users/users.di-tokens';

export type AuthenticatedUserPayload = SafeUser & {
  avatarUrl: string | null;
};

@Injectable()
export class GetAuthenticatedUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profiles: IProfileRepository,
  ) {}

  async execute(userId: string): Promise<AuthenticatedUserPayload> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password: _p, ...safe } = user;
    const profile = await this.profiles.findByUserId(userId);
    return { ...safe, avatarUrl: profile?.avatarUrl ?? null };
  }
}
