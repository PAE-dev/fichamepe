"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

type Props = {
  className?: string;
};

/**
 * CTA compacto hacia planes/cupos. La compra detallada vive en /cuenta/plan.
 */
export function PublicationPlanUpsellStrip({ className = "" }: Props) {
  const user = useAuthStore((s) => s.user);
  if (!user || user.isPublicationExempt) {
    return null;
  }
  return (
    <div
      className={`mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface-elevated/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${className}`}
    >
      <p className="text-sm leading-snug text-foreground">
        ¿Necesitas <span className="font-semibold">más publicaciones activas</span> a la vez? Compra cupos o el plan
        mensual en un solo lugar.
      </p>
      <Link
        href="/cuenta/plan#ampliar-publicaciones"
        className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full border border-primary/30 bg-white px-5 text-sm font-semibold text-primary no-underline transition hover:bg-primary/5 sm:w-auto"
      >
        Ver planes y cupos
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
