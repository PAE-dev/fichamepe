"use client";

import { useEffect, useState } from "react";
import { BadgePercent, Clock3 } from "lucide-react";

const ITEMS = [
  "Top habilidades hoy: edición de video, diseño y traducción",
  "Solo hoy: servicios express con entrega en 24h",
  "Subieron solicitudes de fotografía, eventos y marketing digital",
] as const;

export function PromoBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % ITEMS.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mt-3 rounded-2xl border border-accent/30 bg-accent/10 p-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <BadgePercent className="size-4 text-accent" aria-hidden />
        {ITEMS[index]}
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-accent-red">
          <Clock3 className="size-3" aria-hidden />
          Flash
        </span>
      </p>
    </div>
  );
}
