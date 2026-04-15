import type { SafeUser } from '../../../users/domain/entities';

type SafeUserPublic = Omit<
  SafeUser,
  'referredByUserId' | 'referralMigrationCredits'
>;

/** Payload de GET /auth/me y respuesta de registro (sin contraseña). */
export type AuthenticatedUserResponse = SafeUserPublic & {
  avatarUrl: string | null;
  hasReferredBy: boolean;
  /** Total de filas de servicio (todos los estados). */
  publicationCount: number;
  /** Publicaciones con estado ACTIVA. */
  publicationActiveCount: number;
  /** Tope de ACTIVA según plan, referidos, compras y migración. */
  publicationActiveMax: number | null;
  /**
   * Tope de ACTIVA sin contar el impulso del Plan Pro (solo base + referidos + compras + migración).
   * Sirve para explicar el beneficio Pro: con Pro vigente el tope efectivo es max(10, este valor).
   */
  publicationBaseActiveMax: number | null;
  /**
   * Igual que publicationActiveMax para compatibilidad con clientes antiguos
   * (antes el tope aplicaba al conteo total).
   */
  publicationMax: number | null;
  isPublicationExempt: boolean;
  /** Personas que se registraron con tu código (estadística). */
  referralDirectCount: number;
};
