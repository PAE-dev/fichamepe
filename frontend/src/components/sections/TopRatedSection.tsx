import { ServiceCardLarge } from "@/components/cards/ServiceCardLarge";
import type { ServicePublic } from "@/types/service.types";

export function TopRatedSection({ services }: { services: ServicePublic[] }) {
  const topRated = [...services]
    .sort((a, b) => (b.profile?.rating ?? 0) - (a.profile?.rating ?? 0))
    .slice(0, 3);

  return (
    <section className="space-y-3">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          Los mejor valorados
        </p>
        <h2 className="text-2xl font-bold text-foreground">Talento que mantiene 5 estrellas</h2>
      </header>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {topRated.map((service) => (
          <div key={service.id} className="space-y-2">
            <ServiceCardLarge service={service} />
            <p className="rounded-xl bg-primary/10 px-3 py-2 text-xs text-primary-dark">
              “{service.testimonial ?? "Quedé feliz con el resultado."}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
