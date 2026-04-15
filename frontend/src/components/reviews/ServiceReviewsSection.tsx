"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useAuthModals } from "@/components/auth/auth-modals-context";
import { parseApiErrorMessage } from "@/lib/api/auth.api";
import {
  fetchMyServiceReview,
  fetchServiceReviews,
  postServiceReview,
} from "@/lib/api/service-reviews.api";
import type { ServiceReviewPublic } from "@/types/service-review.types";
import { ReviewStarsDisplay } from "./ReviewStarsDisplay";
import { ServiceReviewCard } from "./ServiceReviewCard";
import { VerifiedPurchaseBanner } from "./VerifiedPurchaseBanner";

type ServiceReviewsSectionProps = {
  serviceId: string;
  serviceTitle: string;
  sellerUserId: string;
  reviewCount?: number;
  reviewAverage?: number;
};

export function ServiceReviewsSection({
  serviceId,
  serviceTitle,
  sellerUserId,
  reviewCount = 0,
  reviewAverage = 0,
}: ServiceReviewsSectionProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { openLogin } = useAuthModals();

  const [items, setItems] = useState<ServiceReviewPublic[]>([]);
  const [total, setTotal] = useState(0);
  const [verifiedInPage, setVerifiedInPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [myReview, setMyReview] = useState<ServiceReviewPublic | null>(null);
  const [myReviewLoaded, setMyReviewLoaded] = useState(false);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetchServiceReviews(serviceId, { limit: 30, offset: 0 });
      setItems(res.items);
      setTotal(res.total);
      setVerifiedInPage(res.verifiedInPage);
    } catch {
      setLoadError("No se pudieron cargar las reseñas.");
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (!user?.id) {
      setMyReview(null);
      setMyReviewLoaded(true);
      return;
    }
    if (user.id === sellerUserId) {
      setMyReview(null);
      setMyReviewLoaded(true);
      return;
    }
    let cancelled = false;
    setMyReviewLoaded(false);
    void (async () => {
      try {
        const mine = await fetchMyServiceReview(serviceId);
        if (!cancelled) {
          setMyReview(mine);
        }
      } catch {
        if (!cancelled) {
          setMyReview(null);
        }
      } finally {
        if (!cancelled) {
          setMyReviewLoaded(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [serviceId, sellerUserId, user?.id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      openLogin();
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const created = await postServiceReview(serviceId, { rating, body: body.trim() });
      setMyReview(created);
      setBody("");
      setItems((prev) => [created, ...prev.filter((x) => x.id !== created.id)]);
      setTotal((t) => t + 1);
      if (created.isVerifiedPurchase) {
        setVerifiedInPage((v) => v + 1);
      }
      router.refresh();
    } catch (err) {
      setSubmitError(parseApiErrorMessage(err, "No se pudo publicar la reseña."));
    } finally {
      setSubmitting(false);
    }
  }

  const summaryLine =
    reviewCount > 0
      ? `${reviewAverage.toFixed(1)} · ${reviewCount} ${reviewCount === 1 ? "reseña" : "reseñas"}`
      : "Aún no hay reseñas";

  const displayItems = useMemo(() => {
    if (!myReview) {
      return items;
    }
    return items.filter((r) => r.id !== myReview.id);
  }, [items, myReview]);

  const verifiedDisplay = useMemo(
    () => displayItems.filter((r) => r.isVerifiedPurchase).length,
    [displayItems],
  );

  return (
    <section className="rounded-3xl border border-border bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="inline-flex items-center gap-1.5 text-lg font-semibold text-foreground">
            Reseñas
            <span title="Opiniones de personas que contrataron o contactaron por este servicio">
              <Info className="size-4 text-muted" aria-hidden />
            </span>
          </h2>
          <p className="mt-1 text-sm text-muted">{summaryLine}</p>
        </div>
      </div>

      <VerifiedPurchaseBanner itemCount={displayItems.length} verifiedInPage={verifiedDisplay} />

      {loadError ? (
        <p className="mt-4 text-sm text-accent-red">{loadError}</p>
      ) : loading ? (
        <div className="mt-6 flex justify-center py-8 text-muted">
          <Loader2 className="size-8 animate-spin" aria-label="Cargando" />
        </div>
      ) : displayItems.length === 0 && !myReview ? (
        <p className="mt-6 text-sm text-muted">Sé el primero en dejar una reseña.</p>
      ) : displayItems.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {displayItems.map((r) => (
            <li key={r.id}>
              <ServiceReviewCard review={r} />
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && total > displayItems.length + (myReview ? 1 : 0) ? (
        <p className="mt-4 text-center text-xs text-muted">
          Mostrando {displayItems.length + (myReview ? 1 : 0)} de {total}
        </p>
      ) : null}

      {user?.id === sellerUserId ? (
        <p className="mt-6 text-sm text-muted">Como vendedor de este servicio no puedes publicar una reseña aquí.</p>
      ) : myReview ? (
        <div className="mt-6 rounded-2xl border border-border bg-surface-elevated/50 p-4">
          <p className="text-sm font-semibold text-foreground">Tu reseña</p>
          <div className="mt-2">
            <ServiceReviewCard review={myReview} />
          </div>
        </div>
      ) : user && !myReviewLoaded ? (
        <div className="mt-6 flex justify-center py-4 text-muted">
          <Loader2 className="size-6 animate-spin" aria-label="Cargando" />
        </div>
      ) : user ? (
        <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-dashed border-primary/30 bg-primary/[0.03] p-4">
          <p className="text-sm font-semibold text-foreground">Escribir una reseña</p>
          <div>
            <p className="mb-2 text-xs font-medium text-muted">Valoración</p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={`rounded-lg border px-2 py-1 text-sm font-semibold transition ${
                      rating === n
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-foreground hover:border-primary/40"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <ReviewStarsDisplay rating={rating} />
            </div>
          </div>
          <div>
            <label htmlFor={`review-body-${serviceId}`} className="mb-1 block text-xs font-medium text-muted">
              Comentario (mín. 10 caracteres)
            </label>
            <textarea
              id={`review-body-${serviceId}`}
              value={body}
              onChange={(ev) => setBody(ev.target.value)}
              rows={4}
              maxLength={2000}
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none ring-primary/30 focus:ring-2"
              placeholder={`Cuéntanos tu experiencia con «${serviceTitle.slice(0, 40)}${serviceTitle.length > 40 ? "…" : ""}»`}
            />
          </div>
          {submitError ? <p className="text-sm text-accent-red">{submitError}</p> : null}
          <button
            type="submit"
            disabled={submitting || body.trim().length < 10}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Publicar reseña
          </button>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl border border-border bg-surface-elevated/50 p-4 text-center">
          <p className="text-sm text-muted">Inicia sesión para dejar una reseña.</p>
          <button
            type="button"
            onClick={() => openLogin()}
            className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Iniciar sesión
          </button>
        </div>
      )}
    </section>
  );
}
