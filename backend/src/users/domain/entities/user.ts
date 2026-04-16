export enum UserRole {
  Freelancer = 'freelancer',
  Client = 'client',
  Admin = 'admin',
}

export class User {
  id: string;
  email: string;
  fullName: string | null;
  /** Hash almacenado (columna `password` en BD). */
  password: string;
  role: UserRole;
  isActive: boolean;
  isPro: boolean;
  proExpiresAt: Date | null;
  tokenBalance: number;
  referralCode: string;
  referredByUserId: string | null;
  referralMigrationCredits: number;
  /** Cupos ganados por referidos (incremental; al leer se aplica tope en lógica de cupo). */
  referralSlotsEarned: number;
  /** Slots permanentes comprados (suma de órdenes cumplidas). */
  purchasedPublicationSlots: number;
  /** null = correo aún no verificado (o cuenta antigua sin columna poblada). */
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<User, 'password'>;
