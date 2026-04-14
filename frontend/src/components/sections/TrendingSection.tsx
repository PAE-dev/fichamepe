import { ServiceCardLarge } from "@/components/cards/ServiceCardLarge";
import type { ServicePublic } from "@/types/service.types";

export function TrendingSection({ services }: { services: ServicePublic[] }) {
  const items = [...services]
    .sort((a, b) => (b.weeklyHires ?? 0) - (a.weeklyHires ?? 0))
    .slice(0, 3);

  return (
    <section className="space-y-3">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          Trending en Lima
        </p>
        <h2 className="text-2xl font-bold text-foreground">Lo mas contratado esta semana</h2>
      </header>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {items.map((service) => (
          <ServiceCardLarge key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
