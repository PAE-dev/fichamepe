"use client";

import { Medal } from "lucide-react";
import { useEngagementStore } from "@/stores/engagementStore";

export function ProgressBar() {
  const progress = useEngagementStore((state) => state.profileProgress);
  const points = useEngagementStore((state) => state.points);

  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Medal className="size-4 text-primary" aria-hidden />
        Completa tu perfil y desbloquea descuentos
      </p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted">
        {progress}% completado · {points} puntos acumulados
      </p>
    </div>
  );
}
