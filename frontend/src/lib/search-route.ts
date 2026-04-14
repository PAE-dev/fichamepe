export function buildExploreSearchUrl(rawQuery: string): string {
  const q = rawQuery.trim();
  if (!q) return "/explorar";
  return `/explorar?search=${encodeURIComponent(q)}`;
}
