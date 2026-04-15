import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { IUserRepository } from '../../../users/domain/repositories';
import { USER_REPOSITORY } from '../../../users/users.di-tokens';
import type { IProfileRepository } from '../../../profiles/domain/repositories/profile.repository.interface';
import { PROFILE_REPOSITORY } from '../../../profiles/profiles.di-tokens';
import type { IServiceRepository } from '../../domain/repositories/i-service.repository';
import { SERVICE_REPOSITORY } from '../../services.di-tokens';
import {
  effectiveActivePublicationMax,
  isPublicationQuotaExemptUser,
  parseReferralPublishExemptEmails,
} from '../../../common/referral/publication-quota';

@Injectable()
export class PublicationSlotsAvailabilityService {
  private readonly logger = new Logger(PublicationSlotsAvailabilityService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profiles: IProfileRepository,
    @Inject(SERVICE_REPOSITORY)
    private readonly services: IServiceRepository,
    private readonly config: ConfigService,
  ) {}

  private exemptEmails(): string[] {
    return parseReferralPublishExemptEmails(
      this.config.get<string>('REFERRAL_PUBLISH_EXEMPT_EMAILS'),
    );
  }

  async assertMayActivateOneMore(
    userId: string,
    profileId: string,
  ): Promise<void> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    const exempt = isPublicationQuotaExemptUser(user, this.exemptEmails());
    if (exempt) {
      return;
    }
    const max = effectiveActivePublicationMax({
      user,
      referralMigrationCredits: user.referralMigrationCredits,
      referralSlotsEarned: user.referralSlotsEarned,
      purchasedPublicationSlots: user.purchasedPublicationSlots,
      now: new Date(),
      isPublicationExempt: false,
    });
    if (max == null) {
      return;
    }
    const active = await this.services.countActiveByProfileId(profileId);
    if (active + 1 > max) {
      throw new BadRequestException(
        `Límite de publicaciones activas alcanzado (${max} máximo). Pausa una publicación, mejora tu plan o compra slots permanentes.`,
      );
    }
  }

  /**
   * Tras bajar el tope (p. ej. expira Pro), pausa ACTIVA sobrantes (conserva las más antiguas).
   */
  async reconcileActivePublicationsForUser(userId: string): Promise<number> {
    const user = await this.users.findById(userId);
    if (!user) {
      return 0;
    }
    if (isPublicationQuotaExemptUser(user, this.exemptEmails())) {
      return 0;
    }
    const profile = await this.profiles.findByUserId(userId);
    if (!profile) {
      return 0;
    }
    const max = effectiveActivePublicationMax({
      user,
      referralMigrationCredits: user.referralMigrationCredits,
      referralSlotsEarned: user.referralSlotsEarned,
      purchasedPublicationSlots: user.purchasedPublicationSlots,
      now: new Date(),
      isPublicationExempt: false,
    });
    if (max == null) {
      return 0;
    }
    const ordered =
      await this.services.findActiveServiceIdsByProfileIdOrderedForReconciliation(
        profile.id,
      );
    if (ordered.length <= max) {
      return 0;
    }
    const toPause = ordered.slice(max);
    await this.services.pauseServicesByIds(toPause);
    this.logger.log(
      `Reconciliación publicaciones user=${userId}: pausadas ${toPause.length} (máx activas ${max}).`,
    );
    return toPause.length;
  }
}
