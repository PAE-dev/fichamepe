import type { User, UserRole } from '../entities';

export interface CreateUserData {
  email: string;
  passwordHash: string;
  fullName?: string | null;
  role?: UserRole;
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
}
