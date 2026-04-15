import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IProfileRepository } from '../../../profiles/domain/repositories';
import { PROFILE_REPOSITORY } from '../../../profiles/profiles.di-tokens';
import type { IUserRepository } from '../../../users/domain/repositories';
import { USER_REPOSITORY } from '../../../users/users.di-tokens';
import type { IServiceRepository } from '../../../services/domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../../services/services.di-tokens';
import {
  baseActivePublicationMax,
  effectiveActivePublicationMax,
  isPublicationQuotaExempt,
  parseReferralPublishExemptEmails,
} from '../../../common/referral/publication-quota';
import type { AuthenticatedUserResponse } from '../types/authenticated-user-response';

@Injectable()
export class GetAuthenticatedUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profiles: IProfileRepository,
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
    private readonly config: ConfigService,
  ) {}

  async execute(userId: string): Promise<AuthenticatedUserResponse> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const profile = await this.profiles.findByUserId(userId);
    const publicationCount = profile
      ? await this.services.countByProfileId(profile.id)
      : 0;
    const publicationActiveCount = profile
      ? await this.services.countActiveByProfileId(profile.id)
      : 0;
    const directReferrals = await this.users.countUsersReferredBy(user.id);
    const exemptEmails = parseReferralPublishExemptEmails(
      this.config.get<string>('REFERRAL_PUBLISH_EXEMPT_EMAILS'),
    );
    const isPublicationExempt = isPublicationQuotaExempt(user, exemptEmails);
    const publicationBaseActiveMax = isPublicationExempt
      ? null
      : baseActivePublicationMax({
          referralMigrationCredits: user.referralMigrationCredits,
          referralSlotsEarned: user.referralSlotsEarned,
          purchasedPublicationSlots: user.purchasedPublicationSlots,
        });
    const publicationActiveMax = isPublicationExempt
      ? null
      : effectiveActivePublicationMax({
          user,
          referralMigrationCredits: user.referralMigrationCredits,
          referralSlotsEarned: user.referralSlotsEarned,
          purchasedPublicationSlots: user.purchasedPublicationSlots,
          now: new Date(),
          isPublicationExempt: false,
        });
    const {
      password: _p,
      referredByUserId,
      referralMigrationCredits: _credits,
      ...safePublic
    } = user;
    return {
      ...safePublic,
      avatarUrl: profile?.avatarUrl ?? null,
      hasReferredBy: referredByUserId != null,
      publicationCount,
      publicationActiveCount,
      publicationActiveMax,
      publicationBaseActiveMax,
      publicationMax: publicationActiveMax,
      isPublicationExempt,
      referralDirectCount: directReferrals,
    };
  }
}
