import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServicePublic } from "@/types/service.types";

export function ComboCard({ items }: { items: ServicePublic[] }) {
  const total = items.reduce((acc, item) => acc + (item.price ?? 0), 0);
  const previousTotal = items.reduce(
    (acc, item) => acc + (item.previousPrice ?? item.price ?? 0),
    0,
  );
  const savings = Math.max(0, previousTotal - total);

  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
        Paquete combo
      </p>
      <h3 className="mt-1 text-lg font-bold text-foreground">
        {items.map((item) => item.tags[0] ?? "Servicio").slice(0, 3).join(" + ")}
      </h3>
      <p className="mt-1 text-sm text-muted">Ahorras S/{savings.toFixed(0)} en combo.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.slice(0, 3).map((item) => (
          <span
            key={item.id}
            className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
          >
            {item.title}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <p className="font-mono text-base font-bold text-foreground">S/{total.toFixed(0)}</p>
        <Link
          href="/explorar"
          className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white no-underline"
        >
          Ver combo
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
