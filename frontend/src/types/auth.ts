export type UserRole = "freelancer" | "client" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  /** Foto pública del perfil (misma URL que en S3); null si no hay perfil o sin avatar. */
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  isPro: boolean;
  proExpiresAt: string | null;
  tokenBalance: number;
  createdAt: string;
  updatedAt: string;
};
