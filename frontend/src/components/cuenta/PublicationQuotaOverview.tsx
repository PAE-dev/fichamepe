"use client";

import { ProgressBar } from "@heroui/react/progress-bar";
import type { AuthUser } from "@/types/auth";

type Props = {
  user: AuthUser;
  /** Total de fichas listadas (todos los estados). */
  totalListings: number;
};

export function PublicationQuotaOverview({ user, totalListings }: Props) {
  if (user.isPublicationExempt) {
    return (
      <section
        className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6"
        aria-labelledby="quota-exempt-heading"
      >
        <h3 id="quota-exempt-heading" className="text-sm font-semibold text-foreground">
          Publicaciones activas
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Tu cuenta no aplica un tope fijo de fichas activas visibles en el marketplace.
        </p>
      </section>
    );
  }

  if (user.publicationActiveMax == null) {
    return null;
  }

  const max = user.publicationActiveMax;
  const active = user.publicationActiveCount;
  const barValue = max > 0 ? Math.min(active, max) : 0;

  return (
    <section
      className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6"
      aria-labelledby="quota-heading"
    >
      <h3 id="quota-heading" className="sr-only">
        Resumen de cupos de publicaciones
      </h3>
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Fichas en tu cuenta</p>
          <p className="mt-2 text-4xl font-extrabold tabular-nums tracking-tight text-foreground sm:text-5xl">
            {totalListings}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Incluye borradores, en revisión, activas, pausadas y demás estados.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Activas en el marketplace</p>
          <p className="mt-2 flex flex-wrap items-baseline gap-1 tabular-nums">
            <span className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">{active}</span>
            <span className="pb-1 text-2xl font-bold text-muted">/</span>
            <span className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{max}</span>
          </p>
          <p className="mt-1 text-xs text-muted">Cuántas puedes tener visibles a la vez hoy.</p>
          <div className="mt-4 space-y-2">
            <ProgressBar
              aria-label={`Publicaciones activas en uso: ${active} de ${max}`}
              minValue={0}
              maxValue={max}
              value={barValue}
              color="default"
              size="md"
              className="w-full"
            >
              <ProgressBar.Track>
                <ProgressBar.Fill className="bg-primary" />
              </ProgressBar.Track>
            </ProgressBar>
          </div>
        </div>
      </div>

      {user.isPro ? (
        <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted">
          Con <strong className="font-semibold text-foreground">Plan Pro</strong> tu tope de activas es más alto
          mientras la suscripción esté vigente. Amplía cupos o packs en la sección de planes si lo necesitas.
        </p>
      ) : null}
      {!user.isPro &&
      user.publicationBaseActiveMax != null &&
      user.publicationBaseActiveMax !== user.publicationActiveMax ? (
        <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted">
          Tu tope actual (<span className="tabular-nums font-semibold text-foreground">{max}</span>) incluye extras
          respecto a la base de{" "}
          <span className="tabular-nums font-semibold text-foreground">{user.publicationBaseActiveMax}</span>{" "}
          (referidos, cupos comprados, etc.).
        </p>
      ) : null}
    </section>
  );
}
