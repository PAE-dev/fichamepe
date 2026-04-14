import { ComboCard } from "@/components/cards/ComboCard";
import type { ServicePublic } from "@/types/service.types";

export function ComboDeals({ services }: { services: ServicePublic[] }) {
  const combos = [
    services.slice(0, 3),
    services.slice(3, 6),
    services.slice(6, 9),
  ].filter((chunk) => chunk.length === 3);

  if (!combos.length) return null;

  return (
    <section className="space-y-3">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent">
          Paquetes combo
        </p>
        <h2 className="text-2xl font-bold text-foreground">Combina servicios y ahorra</h2>
      </header>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {combos.map((items) => (
          <ComboCard key={items.map((item) => item.id).join("-")} items={items} />
        ))}
      </div>
    </section>
  );
}
