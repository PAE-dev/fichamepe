"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { mockServices } from "@/data/mockServices";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAuthStore } from "@/store/auth.store";
import { fetchFavoriteServices } from "@/lib/api/favorites.api";
import type { ServicePublic } from "@/types/service.types";

export default function FavoritosPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const favoritesKey = useFavoritesStore((s) => s.favorites.join(","));
  const favorites = useFavoritesStore((s) => s.favorites);

  const [remoteServices, setRemoteServices] = useState<ServicePublic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setRemoteServices([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void fetchFavoriteServices()
      .then((list) => {
        if (!cancelled) setRemoteServices(list);
      })
      .catch(() => {
        if (!cancelled) setRemoteServices([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, favoritesKey]);

  const items = useMemo(() => {
    if (isAuthenticated) {
      return remoteServices;
    }
    return mockServices.filter((service) => favorites.includes(service.id));
  }, [isAuthenticated, remoteServices, favorites]);

  const isEmpty = !loading && items.length === 0;

  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Tus favoritos</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Los servicios que marques con el corazón aparecen aquí para que los compares y contactes
            cuando quieras.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[340px] animate-pulse rounded-2xl border border-border bg-surface-elevated"
              />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.07] via-surface to-accent/[0.06] px-6 py-14 text-center shadow-sm sm:px-12">
            <div
              className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl"
              aria-hidden
            />

            <div className="relative mx-auto flex max-w-lg flex-col items-center gap-5">
              <div className="flex size-20 items-center justify-center rounded-full border border-primary/20 bg-white shadow-md shadow-primary/10">
                <Heart
                  className="size-9 text-primary"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </div>
              <div className="space-y-2">
                <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-muted shadow-sm backdrop-blur">
                  <Sparkles className="size-3.5 text-accent" aria-hidden />
                  Tu lista personal
                </p>
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {isAuthenticated
                    ? "Aún no tienes favoritos guardados"
                    : "Empieza tu colección de servicios"}
                </h2>
                <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
                  {isAuthenticated ? (
                    <>
                      Explora el marketplace y pulsa el corazón en las tarjetas: así podrás volver a
                      ellos sin buscar de nuevo.
                    </>
                  ) : (
                    <>
                      Marca servicios con el corazón mientras navegas. Si{" "}
                      <span className="font-semibold text-foreground">inicias sesión</span>, tus
                      favoritos se guardan en tu cuenta y los ves desde cualquier dispositivo.
                    </>
                  )}
                </p>
              </div>

              <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/explorar"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white no-underline shadow-md shadow-primary/25 transition hover:opacity-95"
                >
                  Explorar servicios
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                {!isAuthenticated ? (
                  <Link
                    href="/auth/login"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-semibold text-foreground no-underline transition hover:bg-surface-elevated"
                  >
                    Iniciar sesión
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {items.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
