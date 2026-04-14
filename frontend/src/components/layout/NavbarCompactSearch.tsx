"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { buildExploreSearchUrl } from "@/lib/search-route";
import { useSearchStore } from "@/stores/searchStore";

const PLACEHOLDERS = [
  "Busca: editor de TikTok...",
  "Busca: fotografo para evento...",
  "Busca: traductor de CV...",
] as const;

/**
 * Búsqueda del header sin HeroUI SearchField: evita composiciones RAC
 * (ClearButton + Button en Group) que disparan PressResponder y fallos de hidratación.
 */
export function NavbarCompactSearch({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const addRecentSearch = useSearchStore((s) => s.addRecentSearch);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  const submit = useCallback(() => {
    const next = q.trim();
    if (!next) return;
    addRecentSearch(next);
    router.push(buildExploreSearchUrl(next));
  }, [q, router, addRecentSearch]);

  return (
    <form
      className={className}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="flex min-h-11 items-center rounded-full border border-border bg-white shadow-sm transition focus-within:border-primary focus-within:shadow-md">
        <span className="flex shrink-0 pl-3 text-muted">
          <Search className="size-4" aria-hidden strokeWidth={2} />
        </span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={PLACEHOLDERS[placeholderIndex]}
          aria-label="Buscar servicios"
          autoComplete="off"
          className="min-h-11 w-0 min-w-0 flex-1 border-0 bg-transparent py-3 pl-2 pr-2 text-sm text-foreground outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="mr-1.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Search className="size-4" aria-hidden strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}
