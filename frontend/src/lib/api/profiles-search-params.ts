import type { Profile, SearchFilters } from "@/types/profile.types";

export type SearchProfilesApiRow = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  district: string | null;
  hourlyRate: string | null;
  isAvailable: boolean;
  skills: { id: string; name: string; category: string }[];
};

export type SearchProfilesResponse = {
  data: SearchProfilesApiRow[];
  total: number;
  page: number;
  limit: number;
};

export function mapSearchProfileRow(row: SearchProfilesApiRow): Profile {
  const n =
    row.hourlyRate != null && row.hourlyRate !== ""
      ? Number.parseFloat(row.hourlyRate)
      : NaN;
  return {
    id: row.id,
    displayName: row.displayName,
    avatarUrl: row.avatarUrl,
    bio: row.bio,
    district: row.district,
    hourlyRate: Number.isFinite(n) ? n : null,
    isAvailable: row.isAvailable,
    skills: row.skills ?? [],
  };
}

export function appendProfilesSearchParams(
  sp: URLSearchParams,
  filters: SearchFilters,
  page: number,
  limit: number,
) {
  const skills = filters.skill
    ? Array.isArray(filters.skill)
      ? filters.skill
      : [filters.skill]
    : [];
  for (const id of skills) {
    if (id) sp.append("skill", id);
  }
  if (filters.district?.trim()) {
    sp.set("district", filters.district.trim());
  }
  if (filters.isAvailable === true) {
    sp.set("isAvailable", "true");
  }
  if (filters.maxHourlyRate !== undefined) {
    sp.set("maxHourlyRate", String(filters.maxHourlyRate));
  }
  if (filters.search?.trim()) {
    sp.set("search", filters.search.trim());
  }
  if (filters.category?.trim()) {
    sp.set("category", filters.category.trim());
  }
  sp.set("page", String(page));
  sp.set("limit", String(limit));
}
