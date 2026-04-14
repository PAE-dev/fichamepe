import { mockServices } from "@/data/mockServices";
import type { ServicesFeedResponse } from "@/types/service.types";

type FetchFeedServicesParams = {
  limit?: number;
  offset?: number;
  orderBy?: "recent" | "popular" | "random";
  search?: string;
  tags?: string[];
};

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

export async function fetchFeedServicesClient(
  params: FetchFeedServicesParams = {},
): Promise<ServicesFeedResponse> {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  if (!base) {
    return fallbackFromMock(params);
  }

  const sp = new URLSearchParams();
  sp.set("limit", String(params.limit ?? 12));
  sp.set("offset", String(params.offset ?? 0));
  sp.set("orderBy", params.orderBy ?? "random");
  if (params.search?.trim()) sp.set("search", params.search.trim());
  if (params.tags?.length) params.tags.forEach((tag) => sp.append("tags", tag));

  try {
    const res = await fetch(`${base}/services/feed?${sp.toString()}`, {
      credentials: "include",
    });
    if (!res.ok) {
      return fallbackFromMock(params);
    }
    const json: unknown = await res.json();
    const parsed = unwrapApiSuccess<ServicesFeedResponse>(json);
    return {
      ...parsed,
      services: parsed.services,
    };
  } catch {
    return fallbackFromMock(params);
  }
}

function fallbackFromMock(params: FetchFeedServicesParams): ServicesFeedResponse {
  const limit = params.limit ?? 12;
  const offset = params.offset ?? 0;
  return {
    services: mockServices.slice(offset, offset + limit),
    total: mockServices.length,
  };
}
