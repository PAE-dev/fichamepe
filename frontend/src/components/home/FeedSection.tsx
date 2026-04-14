import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { fetchFeedServices } from "@/lib/api/services.api";
import { SITE_TAGLINES } from "@/lib/constants";

export async function FeedSection() {
  let services: Awaited<ReturnType<typeof fetchFeedServices>>["services"] = [];
  let error = false;

  try {
    const res = await fetchFeedServices({ limit: 12, orderBy: "random" });
    services = res.services;
  } catch {
    error = true;
  }

  return (
    <section className="bg-[#FFFFFF] pb-20 pt-5 sm:pt-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6C63FF]">
              Aca hay talento
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#1A1A2E] sm:text-[28px]">
              Servicios que te resuelven hoy
            </h2>
          </div>
          <Link
            href="/explorar"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#6C63FF] no-underline transition-opacity hover:opacity-90"
          >
            Ver todos
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        </div>

        {error ? (
          <p className="rounded-xl border border-[#E5E7EB] bg-[#F5F5FF] px-4 py-6 text-center text-sm text-[#6B7280]">
            Ahora mismo no pudimos cargar el feed. Revisa que el API esté
            arriba y vuelve a intentar.
          </p>
        ) : services.length === 0 ? (
          <p className="text-center text-sm text-[#6B7280]">
            Todavía no hay servicios publicados. Vuelve pronto.{" "}
            <span className="block pt-1 font-medium text-[#6C63FF]">
              {SITE_TAGLINES[9]}
            </span>
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
