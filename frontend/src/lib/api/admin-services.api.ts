import { api } from "@/lib/api";
import { enrichService } from "@/lib/service-enrichment";
import type { ServicePublic } from "@/types/service.types";

function asServicePublic(raw: ServicePublic): ServicePublic {
  return {
    ...raw,
    createdAt:
      typeof raw.createdAt === "string" ? raw.createdAt : String(raw.createdAt ?? ""),
    updatedAt:
      typeof raw.updatedAt === "string" ? raw.updatedAt : String(raw.updatedAt ?? ""),
    moderationComment: raw.moderationComment ?? null,
    submittedAt: raw.submittedAt ?? null,
    reviewedAt: raw.reviewedAt ?? null,
    reviewedByUserId: raw.reviewedByUserId ?? null,
  };
}

export async function fetchAdminReviewQueue(): Promise<ServicePublic[]> {
  const { data } = await api.get<{ services: ServicePublic[] }>("/admin/services/review-queue");
  return (data.services ?? []).map((service) => enrichService(asServicePublic(service)));
}

export async function approveAdminService(id: string): Promise<ServicePublic> {
  const { data } = await api.patch<ServicePublic>(`/admin/services/${id}/approve`);
  return enrichService(asServicePublic(data));
}

export async function requestAdminServiceChanges(
  id: string,
  comment: string,
): Promise<ServicePublic> {
  const { data } = await api.patch<ServicePublic>(`/admin/services/${id}/request-changes`, {
    comment,
  });
  return enrichService(asServicePublic(data));
}
