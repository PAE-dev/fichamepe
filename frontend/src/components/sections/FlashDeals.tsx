import { ServiceCard } from "@/components/cards/ServiceCard";
import type { ServicePublic } from "@/types/service.types";

export function FlashDeals({ services }: { services: ServicePublic[] }) {
  const items = services.filter((service) => service.flashDealEndsAt).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <section className="space-y-3">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent-red">
          Ofertas relampago
        </p>
        <h2 className="text-2xl font-bold text-foreground">Aprovecha antes que vuelen</h2>
      </header>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {items.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
