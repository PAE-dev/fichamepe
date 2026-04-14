import "server-only";

import type { Profile, SearchFilters } from "@/types/profile.types";
import {
  appendProfilesSearchParams,
  mapSearchProfileRow,
  type SearchProfilesResponse,
} from "@/lib/api/profiles-search-params";

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

export async function searchProfilesCached(
  filters: SearchFilters,
  page: number,
  limit: number,
  revalidateSeconds = 300,
): Promise<{
  data: Profile[];
  total: number;
  page: number;
  limit: number;
}> {
  const sp = new URLSearchParams();
  appendProfilesSearchParams(sp, filters, page, limit);
  const url = `${getApiBaseUrl()}/profiles/search?${sp.toString()}`;
  const res = await fetch(url, {
    next: { revalidate: revalidateSeconds },
  });
  if (!res.ok) {
    throw new Error(`profiles/search falló: ${res.status}`);
  }
  const json: unknown = await res.json();
  const body = unwrapApiSuccess<SearchProfilesResponse>(json);
  return {
    data: (body.data ?? []).map(mapSearchProfileRow),
    total: body.total ?? 0,
    page: body.page ?? page,
    limit: body.limit ?? limit,
  };
}
