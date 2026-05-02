"use client";

import { Building2 } from "lucide-react";

type CoworkingAfterDismissCtaProps = {
  onRequestCoworking: () => void;
};

/**
 * Tras cerrar la notificación grande, deja un acceso permanente (mock) al mismo flujo de espacios.
 */
export function CoworkingAfterDismissCta({ onRequestCoworking }: CoworkingAfterDismissCtaProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/15 bg-primary/[0.04] px-3 py-2.5 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="size-4" aria-hidden />
        </span>
        <p className="min-w-0 text-sm leading-snug text-muted">
          <span className="font-medium text-foreground">Coworking</span>
          {" · "}
          Solicita un espacio cuando quieran coordinar en persona.
        </p>
      </div>
      <button
        type="button"
        onClick={onRequestCoworking}
        className="shrink-0 rounded-full border border-primary/30 bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-primary/5"
      >
        Solicitar coworking
      </button>
    </div>
  );
}
