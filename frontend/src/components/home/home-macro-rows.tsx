import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { searchProfilesCached } from "@/lib/api/profiles-search.server";
import { HOME_MACRO_CATEGORIES } from "@/lib/constants";
import { FreelancerCard } from "@/components/ui/FreelancerCard";

export async function HomeMacroRows() {
  const rows = await Promise.all(
    HOME_MACRO_CATEGORIES.map(async (cat) => {
      try {
        const res = await searchProfilesCached(
          { category: cat.slug, isAvailable: true },
          1,
          6,
        );
        return { cat, data: res.data, total: res.total };
      } catch {
        return { cat, data: [], total: 0 };
      }
    }),
  );

  const withData = rows.filter((r) => r.data.length > 0);

  return (
    <>
      {withData.map((row, i) => {
        const Icon = row.cat.icon;
        const bg = i % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#F5F5FF]";
        return (
          <section key={row.cat.slug} className={`py-10 ${bg}`}>
            <div className="mx-auto max-w-6xl px-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Icon
                    className="size-6 shrink-0 text-[#6C63FF]"
                    aria-hidden
                  />
                  <h2 className="text-lg font-bold text-[#1A1A2E]">
                    {row.cat.label}
                  </h2>
                  <span className="text-sm text-[#6B7280]">
                    ({row.total} freelancers)
                  </span>
                </div>
                <Link
                  href={`/explorar?macroCategory=${encodeURIComponent(row.cat.slug)}`}
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#6C63FF] underline-offset-4 transition-colors hover:underline"
                >
                  Ver todos
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
              <div className="fp-scroll-x flex gap-4 overflow-x-auto pb-2">
                {row.data.map((p) => (
                  <FreelancerCard
                    key={p.id}
                    profile={p}
                    className="w-[260px] min-w-[260px] shrink-0"
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
