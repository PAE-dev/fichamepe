import type { User } from '../../users/domain/entities/user';
import {
  PUBLICATION_BASE_LIMIT,
  PUBLICATION_EXEMPT_MAX,
  baseActivePublicationMax,
  effectiveActivePublicationMax,
  isPublicationQuotaExemptUser,
} from '../publication/publication-slots';

export {
  PUBLICATION_BASE_LIMIT,
  PUBLICATION_EXEMPT_MAX,
  baseActivePublicationMax,
  effectiveActivePublicationMax,
  isPublicationQuotaExemptUser,
};

const DEFAULT_EXEMPT_EMAIL = 'leonardpostillos@gmail.com';

export function parseReferralPublishExemptEmails(
  raw: string | undefined,
): string[] {
  const fromEnv = (raw ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const set = new Set<string>([DEFAULT_EXEMPT_EMAIL, ...fromEnv]);
  return Array.from(set);
}

/** Alias; delega en isPublicationQuotaExemptUser. */
export function isPublicationQuotaExempt(
  user: Pick<User, 'email' | 'role'>,
  exemptEmails: string[],
): boolean {
  return isPublicationQuotaExemptUser(user, exemptEmails);
}
