"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HOME_MACRO_CATEGORIES } from "@/lib/constants";

export function CategoryBar({
  counts,
  activeCategory = "",
}: {
  counts?: Partial<Record<(typeof HOME_MACRO_CATEGORIES)[number]["slug"], number>>;
  activeCategory?: string;
}) {
  const pathname = usePathname();
  const active = activeCategory;
  const isExplore = pathname.startsWith("/explorar");

  return (
    <div className="sticky top-[72px] z-40 border-y border-border/70 bg-white/85 backdrop-blur">
      <div className="fp-scroll-x mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2">
        <Link
          href="/explorar"
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            !active && isExplore
              ? "bg-primary text-white shadow-sm"
              : "border border-border text-foreground hover:border-primary/30 hover:text-primary"
          }`}
        >
          Todo Lima
        </Link>
        {HOME_MACRO_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = active === category.slug;
          return (
            <Link
              key={category.slug}
              href={`/explorar?macroCategory=${encodeURIComponent(category.slug)}`}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "scale-[1.02] bg-primary text-white shadow-sm"
                  : "border border-border text-foreground hover:border-primary/30 hover:text-primary"
              }`}
            >
              <Icon className="size-3.5" aria-hidden />
              {category.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                }`}
              >
                {counts?.[category.slug] ?? 0}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
