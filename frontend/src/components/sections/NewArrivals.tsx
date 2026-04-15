import { ServiceCard } from "@/components/cards/ServiceCard";
import type { ServicePublic } from "@/types/service.types";

export function NewArrivals({ services }: { services: ServicePublic[] }) {
  const latest = [...services]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  return (
    <section className="space-y-3">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          Recien llegados
        </p>
        <h2 className="text-2xl font-bold text-foreground">Nuevos perfiles con precio lanzamiento</h2>
      </header>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {latest.map((service) => (
          <div key={service.id} className="h-full min-h-0">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </section>
  );
}
