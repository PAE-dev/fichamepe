"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, Flame, Search } from "lucide-react";
import { Button } from "@heroui/react/button";
import { SearchField } from "@heroui/react/search-field";
import { buildExploreSearchUrl } from "@/lib/search-route";
import { useSearchStore } from "@/stores/searchStore";

const TRENDING = [
  "editor de TikTok",
  "fotografo para evento",
  "traductor de CV",
  "diseño de logo",
  "DJ para fiesta",
] as const;

const PLACEHOLDERS = [
  "Busca: editor de TikTok...",
  "Busca: fotografo para evento...",
  "Busca: traductor de CV...",
] as const;

export function SearchBar({
  compact = false,
  className = "",
  value,
  onValueChange,
  onSubmit,
  showPanel = !compact,
  showSubmitButton = !compact,
}: {
  compact?: boolean;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  showPanel?: boolean;
  showSubmitButton?: boolean;
}) {
  const router = useRouter();
  const [internalQuery, setInternalQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const recentSearches = useSearchStore((state) => state.recentSearches);
  const addRecentSearch = useSearchStore((state) => state.addRecentSearch);
  const query = value ?? internalQuery;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  const suggestions = query
    ? TRENDING.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : TRENDING.slice(0, 4);

  const submit = (value: string) => {
    const next = value.trim();
    if (!next) return;
    addRecentSearch(next);
    onSubmit?.(next);
    router.push(buildExploreSearchUrl(next));
  };

  return (
    <div className={`relative ${className}`}>
      <SearchField
        value={query}
        onChange={(next) => {
          if (value !== undefined) onValueChange?.(next);
          else setInternalQuery(next);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit(query);
        }}
        className="w-full"
        aria-label="Buscar servicios"
      >
        <SearchField.Group className="min-h-11 rounded-full border border-border bg-white shadow-sm transition focus-within:border-primary focus-within:shadow-md">
          <SearchField.SearchIcon className="pl-3 text-muted">
            <Search className="size-4" aria-hidden />
          </SearchField.SearchIcon>
          <SearchField.Input
            placeholder={PLACEHOLDERS[placeholderIndex]}
            className={`${compact ? "text-sm" : "text-base"} text-foreground placeholder:text-muted`}
          />
          {showSubmitButton ? (
            <Button
              type="button"
              size={compact ? "sm" : "md"}
              className="mr-1.5 rounded-full bg-primary px-4 font-semibold text-white"
              onPress={() => submit(query)}
            >
              Buscar
            </Button>
          ) : (
            <Button
              isIconOnly
              type="button"
              size="sm"
              className="mr-1.5 rounded-full bg-primary text-white"
              onPress={() => submit(query)}
              aria-label="Buscar"
            >
              <Search className="size-4" aria-hidden />
            </Button>
          )}
        </SearchField.Group>
      </SearchField>

      {showPanel ? (
        <div className="mt-2 rounded-2xl border border-border bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted">
            <Flame className="size-3.5 text-accent" aria-hidden />
            Trending en Lima
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
                onClick={() => submit(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {recentSearches.length > 0 ? (
            <>
              <div className="mb-2 mt-3 flex items-center gap-2 text-xs font-semibold text-muted">
                <Clock3 className="size-3.5" aria-hidden />
                Recientes
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.slice(0, 4).map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="rounded-full border border-border px-3 py-1 text-xs text-foreground transition hover:border-primary hover:text-primary"
                    onClick={() => submit(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
