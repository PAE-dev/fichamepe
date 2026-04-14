import { api } from "@/lib/api";
import { enrichService } from "@/lib/service-enrichment";
import type { ServicePublic } from "@/types/service.types";

export async function fetchFavoriteIds(): Promise<string[]> {
  const { data } = await api.get<{ ids: string[] }>("/services/favorites/ids");
  return data.ids;
}

function asServicePublic(raw: ServicePublic): ServicePublic {
  return {
    ...raw,
    createdAt:
      typeof raw.createdAt === "string" ? raw.createdAt : String(raw.createdAt ?? ""),
    updatedAt:
      typeof raw.updatedAt === "string" ? raw.updatedAt : String(raw.updatedAt ?? ""),
  };
}

export async function fetchFavoriteServices(): Promise<ServicePublic[]> {
  const { data } = await api.get<{ services: ServicePublic[] }>("/services/favorites");
  return (data.services ?? []).map((s) => enrichService(asServicePublic(s)));
}

export async function addFavorite(serviceId: string): Promise<void> {
  await api.post("/services/favorites", { serviceId });
}

export async function removeFavorite(serviceId: string): Promise<void> {
  await api.delete(`/services/favorites/${encodeURIComponent(serviceId)}`);
}
