import { api } from "@/lib/api";
import type { Profile, SearchFilters } from "@/types/profile.types";
import {
  appendProfilesSearchParams,
  mapSearchProfileRow,
  type SearchProfilesResponse,
} from "@/lib/api/profiles-search-params";

export async function searchProfiles(
  filters: SearchFilters,
  page: number,
  limit: number,
): Promise<{
  data: Profile[];
  total: number;
  page: number;
  limit: number;
}> {
  const sp = new URLSearchParams();
  appendProfilesSearchParams(sp, filters, page, limit);
  const res = await api.get<SearchProfilesResponse>(
    `/profiles/search?${sp.toString()}`,
  );
  const body = res.data;
  return {
    data: (body.data ?? []).map(mapSearchProfileRow),
    total: body.total ?? 0,
    page: body.page ?? page,
    limit: body.limit ?? limit,
  };
}
