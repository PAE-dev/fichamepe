import { api } from "@/lib/api";

export type AdminUserRole = "admin" | "freelancer" | "client";

export type AdminUserRow = {
  id: string;
  email: string;
  fullName: string | null;
  role: AdminUserRole;
  isActive: boolean;
  createdAt: string;
  profile: { displayName: string; avatarUrl: string | null } | null;
  lastLogin: { at: string; ip: string; userAgent: string } | null;
  presence: { lastSeenAt: string; ip: string; userAgent: string } | null;
};

export type AdminUsersResponse = {
  total: number;
  items: AdminUserRow[];
};

export async function fetchAdminUsers(params?: {
  search?: string;
  role?: AdminUserRole;
  offset?: number;
  limit?: number;
}): Promise<AdminUsersResponse> {
  const { data } = await api.get<AdminUsersResponse>("/admin/users", { params });
  return data;
}

