"use client";

import { Info, ShieldCheck } from "lucide-react";

export function VerifiedPurchaseBanner({
  itemCount,
  verifiedInPage,
}: {
  itemCount: number;
  verifiedInPage: number;
}) {
  if (itemCount === 0) {
    return null;
  }
  if (verifiedInPage === itemCount) {
    return (
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-success/40 bg-success/5 px-4 py-3">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
          <p className="text-sm font-medium text-foreground">
            Todas las reseñas mostradas aquí son de compras verificadas: iniciaste una conversación con el
            vendedor por este servicio.
          </p>
        </div>
      </div>
    );
  }
  if (verifiedInPage > 0) {
    return (
      <div className="flex flex-wrap items-start gap-2 rounded-2xl border border-border bg-surface-elevated/80 px-4 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
        <p className="text-sm text-muted">
          Las reseñas con insignia verde son de compras verificadas (hubo conversación por este servicio entre
          comprador y vendedor).
        </p>
      </div>
    );
  }
  return null;
}
