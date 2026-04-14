import { api } from "@/lib/api";
import type { AuthUser } from "@/types/auth";

export function parseApiErrorMessage(e: unknown, fallback: string): string {
  if (typeof e !== "object" || e === null || !("response" in e)) {
    return fallback;
  }
  const data = (e as { response?: { data?: unknown } }).response?.data;
  if (!data || typeof data !== "object") {
    return fallback;
  }
  const d = data as { message?: unknown; detail?: unknown };
  const detail = typeof d.detail === "string" && d.detail.length ? d.detail : undefined;
  const raw = d.message;
  let msg: string | undefined;
  if (typeof raw === "string") msg = raw;
  else if (Array.isArray(raw)) msg = raw.join(", ");
  if (detail && (msg === "Error interno del servidor" || !msg)) {
    return detail;
  }
  if (msg) return msg;
  if (detail) return detail;
  return fallback;
}

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  /** Si no se envía, el backend asigna rol por defecto (freelancer). */
  role?: "client" | "freelancer";
};

/** POST /auth/register — respuesta del backend (cookies de refresh las maneja axios). */
export async function registerAccount(
  payload: RegisterPayload,
): Promise<{ accessToken: string; user: AuthUser }> {
  const body: Record<string, unknown> = {
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  };
  if (payload.role !== undefined) {
    body.role = payload.role;
  }
  const { data } = await api.post<{ accessToken: string; user: AuthUser }>(
    "/auth/register",
    body,
  );
  return {
    accessToken: data.accessToken,
    user: { ...data.user, avatarUrl: data.user.avatarUrl ?? null },
  };
}

/** POST /auth/login */
export async function postLogin(
  email: string,
  password: string,
): Promise<{ accessToken: string }> {
  const { data } = await api.post<{ accessToken: string }>("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });
  return data;
}

/** GET /auth/me (requiere Bearer ya configurado en el cliente). */
export async function fetchAuthMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/auth/me");
  return { ...data, avatarUrl: data.avatarUrl ?? null };
}

export type ForgotPasswordResponse = {
  message: string;
  /** Solo fuera de producción (o PASSWORD_RESET_DEV_LINK) si el correo existe. */
  resetToken?: string;
};

/** POST /auth/forgot-password */
export async function postForgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const { data } = await api.post<ForgotPasswordResponse>("/auth/forgot-password", {
    email: email.trim().toLowerCase(),
  });
  return data;
}

/** POST /auth/reset-password */
export async function postResetPassword(token: string, newPassword: string): Promise<void> {
  await api.post("/auth/reset-password", { token, newPassword });
}
