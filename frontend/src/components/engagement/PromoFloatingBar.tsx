"use client";

import { Gift } from "lucide-react";
import { useEngagementStore } from "@/stores/engagementStore";

export function PromoFloatingBar() {
  const promoCode = useEngagementStore((state) => state.promoCode);

  return (
    <div className="fixed bottom-14 left-3 right-3 z-40 rounded-2xl border border-accent/35 bg-accent/15 p-3 md:bottom-4 md:left-auto md:right-4 md:w-[360px]">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Gift className="size-4 text-accent" aria-hidden />
        Primera compra con 20% OFF
      </p>
      <p className="mt-1 text-xs text-muted">
        Codigo: <span className="font-mono font-bold text-foreground">{promoCode ?? "FICHAME20"}</span>
      </p>
    </div>
  );
}
