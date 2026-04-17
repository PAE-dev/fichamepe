import { isAxiosError } from "axios";
import { api } from "@/lib/api";

export type PresignUploadResponse = {
  uploadUrl: string;
  key: string;
  readUrl: string;
  publicUrl: string;
};

export type PresignUploadType = "avatar" | "portfolio" | "service_cover";

export async function presignAvatarUpload(
  filename: string,
  contentType: string,
): Promise<PresignUploadResponse> {
  const { data } = await api.post<PresignUploadResponse>("/uploads/presign", {
    type: "avatar",
    filename,
    contentType,
  });
  return data;
}

export async function presignUpload(
  type: PresignUploadType,
  filename: string,
  contentType: string,
): Promise<PresignUploadResponse> {
  const { data } = await api.post<PresignUploadResponse>("/uploads/presign", {
    type,
    filename,
    contentType,
  });
  return data;
}

export async function putFileToPresignedUrl(
  uploadUrl: string,
  file: Blob,
  contentType: string,
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": contentType },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const hint =
      res.status === 403 && detail.includes("SignatureDoesNotMatch")
        ? " Firma no coincide (revisa que el backend esté actualizado; presign sin checksum opcional)."
        : "";
    throw new Error(
      `Fallo al subir la imagen (${res.status})${hint}${detail ? `: ${detail.slice(0, 200)}` : ""}`,
    );
  }
}

export type PatchUserBody = {
  email?: string;
  fullName?: string;
  /** Solo `false`: desactiva la cuenta (no se puede reactivar desde la app). */
  isActive?: boolean;
  /** ISO 3166-1 alpha-2 (p. ej. PE), alineado con el selector de país del feed. */
  countryCode?: string;
};

export async function patchCurrentUser(userId: string, body: PatchUserBody): Promise<void> {
  await api.patch(`/users/${userId}`, body);
}

export type PatchProfileBody = {
  avatarUrl?: string | null;
  displayName?: string;
};

export async function patchProfileByUserId(
  userId: string,
  body: PatchProfileBody,
): Promise<void> {
  await api.patch(`/profiles/by-user/${userId}`, body);
}

export type CreateProfileBody = {
  displayName: string;
  avatarUrl?: string | null;
};

export async function postProfile(body: CreateProfileBody): Promise<void> {
  await api.post("/profiles", body);
}

export function isNotFoundError(e: unknown): boolean {
  return isAxiosError(e) && e.response?.status === 404;
}
