import type { AuthUser } from "@/types/auth";

/** Respuestas antiguas del API sin `emailVerified` se tratan como cuenta ya válida. */
export function normalizeAuthUser(u: AuthUser): AuthUser {
  return {
    ...u,
    emailVerified: u.emailVerified !== false,
  };
}
