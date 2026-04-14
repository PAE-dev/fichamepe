import "server-only";

import type { ServicePublic, ServicesFeedResponse } from "@/types/service.types";
import { mockServices } from "@/data/mockServices";
import { enrichService } from "@/lib/service-enrichment";

function unwrapApiSuccess<T>(data: unknown): T {
  if (
    data !== null &&
    typeof data === "object" &&
    "success" in data &&
    (data as { success: unknown }).success === true &&
    "data" in data
  ) {
    return (data as { data: T }).data;
  }
  return data as T;
}

function getApiBaseUrl(): string {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL no está definido");
  }
  return base;
}

export type FetchFeedServicesParams = {
  limit?: number;
  offset?: number;
  orderBy?: "recent" | "popular" | "random";
  search?: string;
  tags?: string[];
};

export async function fetchFeedServices(
  params: FetchFeedServicesParams = {},
): Promise<ServicesFeedResponse> {
  const sp = new URLSearchParams();
  sp.set("limit", String(params.limit ?? 12));
  sp.set("offset", String(params.offset ?? 0));
  sp.set("orderBy", params.orderBy ?? "random");
  if (params.search?.trim()) {
    sp.set("search", params.search.trim());
  }
  if (params.tags?.length) {
    for (const t of params.tags) {
      sp.append("tags", t);
    }
  }
  const url = `${getApiBaseUrl()}/services/feed?${sp.toString()}`;
  const res = await fetch(url, {
    next: { revalidate: 0 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    throw new Error(`services/feed falló: ${res.status}`);
  }
  const json: unknown = await res.json();
  const data = unwrapApiSuccess<ServicesFeedResponse>(json);
  return {
    ...data,
    services: data.services.map(enrichService),
  };
}

export async function fetchServiceById(id: string): Promise<ServicePublic> {
  const url = `${getApiBaseUrl()}/services/${encodeURIComponent(id)}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    throw new Error(`services/${id} falló: ${res.status}`);
  }
  const json: unknown = await res.json();
  return enrichService(unwrapApiSuccess<ServicePublic>(json));
}

export async function fetchFeedServicesSafe(
  params: FetchFeedServicesParams = {},
): Promise<ServicesFeedResponse> {
  try {
    return await fetchFeedServices(params);
  } catch {
    const limit = params.limit ?? 12;
    const offset = params.offset ?? 0;
    const services = mockServices.slice(offset, offset + limit).map((s) => enrichService(s));
    return {
      services,
      total: mockServices.length,
    };
  }
}

