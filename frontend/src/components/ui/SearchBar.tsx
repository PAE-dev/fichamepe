"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, Flame, Search } from "lucide-react";
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
      <form
        className="w-full"
        role="search"
        aria-label="Buscar servicios"
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
      >
        <div className="flex min-h-11 items-center rounded-full border border-border bg-white shadow-sm transition focus-within:border-primary focus-within:shadow-md">
          <span className="flex shrink-0 pl-3 text-muted">
            <Search className="size-4" aria-hidden />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              const next = e.target.value;
              if (value !== undefined) onValueChange?.(next);
              else setInternalQuery(next);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit(query);
            }}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            aria-label="Buscar servicios"
            autoComplete="off"
            className={`min-h-11 w-0 min-w-0 flex-1 border-0 bg-transparent py-3 pl-2 pr-2 ${
              compact ? "text-sm" : "text-base"
            } text-foreground outline-none placeholder:text-muted`}
          />
          {showSubmitButton ? (
            <button
              type="submit"
              className="mr-1.5 inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Buscar
            </button>
          ) : (
            <button
              type="submit"
              aria-label="Buscar"
              className="mr-1.5 inline-flex size-9 items-center justify-center rounded-full bg-primary text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Search className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </form>

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
