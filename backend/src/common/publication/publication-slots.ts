import type { User } from '../../users/domain/entities/user';
import { UserRole } from '../../users/domain/entities/user';

/** Publicaciones simultáneamente ACTIVAS en plan gratuito (sin contar referidos/compras/migración). */
export const PUBLICATION_BASE_LIMIT = 3;

/** Máximo de cupos extra que cuentan por programa de referidos (anti-abuso). */
export const REFERRAL_PUBLICATION_BONUS_CAP = 3;

/** Tope de activas que aporta la suscripción Pro (puede subir si el cupo base ya es mayor). */
export const PRO_ACTIVE_SUBSCRIPTION_FLOOR = 10;

/** Tope práctico para admin / correos exentos. */
export const PUBLICATION_EXEMPT_MAX = 10_000;

/** Límite de filas de servicio por perfil (borradores + todo estado) para cuentas no exentas. */
export const MAX_SERVICE_RECORDS_NONEXEMPT = 100;

export function cappedReferralBonusSlots(referralSlotsEarned: number): number {
  return Math.min(
    REFERRAL_PUBLICATION_BONUS_CAP,
    Math.max(0, Math.floor(referralSlotsEarned)),
  );
}

/** Cupo máximo de publicaciones ACTIVA sin aplicar suscripción Pro. */
export function baseActivePublicationMax(params: {
  referralMigrationCredits: number;
  referralSlotsEarned: number;
  purchasedPublicationSlots: number;
}): number {
  return (
    PUBLICATION_BASE_LIMIT +
    (params.referralMigrationCredits ?? 0) +
    cappedReferralBonusSlots(params.referralSlotsEarned) +
    (params.purchasedPublicationSlots ?? 0)
  );
}

export function effectiveActivePublicationMax(params: {
  user: Pick<User, 'isPro' | 'proExpiresAt'>;
  referralMigrationCredits: number;
  referralSlotsEarned: number;
  purchasedPublicationSlots: number;
  now: Date;
  isPublicationExempt: boolean;
}): number | null {
  if (params.isPublicationExempt) {
    return null;
  }
  const base = baseActivePublicationMax({
    referralMigrationCredits: params.referralMigrationCredits,
    referralSlotsEarned: params.referralSlotsEarned,
    purchasedPublicationSlots: params.purchasedPublicationSlots,
  });
  const proExpires = params.user.proExpiresAt;
  const proOk =
    params.user.isPro &&
    proExpires != null &&
    proExpires.getTime() > params.now.getTime();
  if (proOk) {
    return Math.max(PRO_ACTIVE_SUBSCRIPTION_FLOOR, base);
  }
  return base;
}

export function isPublicationQuotaExemptUser(
  user: Pick<User, 'email' | 'role'>,
  exemptEmails: string[],
): boolean {
  if (user.role === UserRole.Admin) {
    return true;
  }
  const em = user.email.trim().toLowerCase();
  return exemptEmails.includes(em);
}
