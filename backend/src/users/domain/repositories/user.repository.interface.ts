import type { User, UserRole } from '../entities';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  fullName?: string | null;
  role?: UserRole;
  referredByUserId?: string | null;
}

export type UserUpdatePatch = Partial<
  Pick<
    User,
    | 'email'
    | 'fullName'
    | 'isActive'
    | 'isPro'
    | 'proExpiresAt'
    | 'tokenBalance'
    | 'role'
  >
>;

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByReferralCode(code: string): Promise<User | null>;
  countUsersReferredBy(referrerUserId: string): Promise<number>;
  /**
   * Asigna referidor solo si aún no tenía uno. Devuelve true si se actualizó.
   */
  applyReferredByIfEmpty(userId: string, referrerUserId: string): Promise<boolean>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, patch: UserUpdatePatch): Promise<User | null>;
  /** Devuelve true si existía un usuario con ese correo. */
  setPasswordResetByEmail(
    email: string,
    token: string,
    expires: Date,
  ): Promise<boolean>;
  /** Actualiza contraseña y borra token si el token es válido y no ha expirado. */
  consumePasswordReset(token: string, newPasswordHash: string): Promise<boolean>;

  /** Suma 1 al contador de cupos por referido del referidor, sin superar `cap`. */
  incrementReferralSlotsEarnedCapped(
    referrerUserId: string,
    cap: number,
  ): Promise<void>;

  /** Suma slots comprados cumplidos al usuario. */
  incrementPurchasedPublicationSlots(userId: string, delta: number): Promise<void>;
}
