"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "@heroui/react/modal";
import { ArrowRight, Layers, LogIn, Megaphone, Sparkles } from "lucide-react";
import { Button } from "@heroui/react/button";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { useAuthStore } from "@/store/auth.store";
import {
  deleteSkill,
  fetchMyPublications,
  pauseSkill,
  publishSkill,
  reactivateSkill,
} from "@/lib/api/my-services.api";
import type { ServicePublic } from "@/types/service.types";

type PublicationFilter = "all" | ServicePublic["status"];

const FILTERS: Array<{ key: PublicationFilter; label: string }> = [
  { key: "all", label: "Todas" },
  { key: "EN_REVISION", label: "En revisión" },
  { key: "REQUIERE_CAMBIOS", label: "Correcciones pendientes" },
  { key: "ACTIVA", label: "Activas" },
  { key: "BORRADOR", label: "Borradores" },
  { key: "PAUSADA", label: "Pausadas" },
];

export default function CuentaPublicacionesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [items, setItems] = useState<ServicePublic[]>([]);
  const [loading, setLoading] = useState(() => useAuthStore.getState().isAuthenticated);
  const [loadError, setLoadError] = useState(false);
  const [deleting, setDeleting] = useState<ServicePublic | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const initialFilter = searchParams.get("filtro");
  const [filter, setFilter] = useState<PublicationFilter>(
    initialFilter === "ACTIVA" ||
      initialFilter === "BORRADOR" ||
      initialFilter === "PAUSADA" ||
      initialFilter === "EN_REVISION" ||
      initialFilter === "REQUIERE_CAMBIOS"
      ? initialFilter
      : "all",
  );

  const reload = async () => {
    const list = await fetchMyPublications();
    setItems(list);
  };

  useEffect(() => {
    const nextFilter = searchParams.get("filtro");
    if (
      nextFilter === "ACTIVA" ||
      nextFilter === "BORRADOR" ||
      nextFilter === "PAUSADA" ||
      nextFilter === "EN_REVISION" ||
      nextFilter === "REQUIERE_CAMBIOS"
    ) {
      setFilter(nextFilter);
      return;
    }
    setFilter("all");
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    let cancelled = false;
    void (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setLoadError(false);
      try {
        const list = await fetchMyPublications();
        if (!cancelled) setItems(list);
      } catch {
        if (!cancelled) {
          setItems([]);
          setLoadError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const isEmpty = isAuthenticated && !loading && !loadError && items.length === 0;
  const toast = searchParams.get("toast");
  const filteredItems = items.filter((item) => (filter === "all" ? true : item.status === filter));

  return (
    <div className="w-full">
      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Marketplace</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Mis publicaciones
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
          Aquí ves todo lo que ofreces como freelancer: estado, vistas y acceso rápido a cada ficha.
        </p>
        {isAuthenticated && !loading && !loadError ? (
          <>
            <p className="mt-3 text-sm font-medium text-foreground">
              {items.length === 1 ? "1 publicación" : `${items.length} publicaciones`}
            </p>
            {toast === "review-submitted" ? (
              <p className="mt-3 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                Tu publicación fue enviada a revisión. Te avisaremos cuando esté aprobada o si requiere
                ajustes.
              </p>
            ) : null}
            {toast === "draft-saved" ? (
              <p className="mt-3 rounded-xl border border-border bg-surface-elevated px-3 py-2 text-sm font-medium text-muted">
                Guardaste tu publicación como borrador.
              </p>
            ) : null}
          </>
        ) : null}
      </header>

      {!isAuthenticated ? (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.08] via-white to-primary-light/[0.06] px-6 py-14 text-center shadow-sm sm:px-12">
          <div
            className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-primary-light/20 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto flex max-w-lg flex-col items-center gap-5">
            <div className="flex size-20 items-center justify-center rounded-full border border-primary/25 bg-white shadow-md shadow-primary/10">
              <LogIn className="size-9 text-primary" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="space-y-2">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/90 px-3 py-1 text-xs font-medium text-muted shadow-sm backdrop-blur">
                <Sparkles className="size-3.5 text-accent" aria-hidden />
                Acceso a tu vitrina
              </p>
              <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Inicia sesión para ver tus publicaciones
              </h3>
              <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
                Tus servicios publicados se guardan en tu cuenta. Entra con tu correo y revisa o
                amplía tu oferta cuando quieras.
              </p>
            </div>
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/auth/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-white no-underline shadow-md shadow-primary/25 transition hover:opacity-95"
              >
                Iniciar sesión
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/explorar"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-semibold text-foreground no-underline transition hover:bg-surface-elevated"
              >
                Explorar servicios
              </Link>
            </div>
          </div>
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-border bg-surface-elevated px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No pudimos cargar tus publicaciones</p>
          <p className="mt-1 text-sm text-muted">Revisa tu conexión e inténtalo de nuevo.</p>
          <Button
            variant="primary"
            className="mt-6 rounded-full bg-primary px-6 font-semibold text-white"
            onPress={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[360px] animate-pulse rounded-2xl border border-border bg-surface-elevated"
            />
          ))}
        </div>
      ) : isEmpty ? (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/[0.07] via-white to-accent/[0.05] px-6 py-14 text-center shadow-sm sm:px-12">
          <div
            className="pointer-events-none absolute -right-16 top-0 h-52 w-52 rounded-full bg-primary/12 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-accent/10 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto flex max-w-lg flex-col items-center gap-5">
            <div className="flex size-20 items-center justify-center rounded-full border border-primary/20 bg-white shadow-md shadow-primary/10">
              <Megaphone className="size-9 text-primary" strokeWidth={1.65} aria-hidden />
            </div>
            <div className="space-y-2">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/85 px-3 py-1 text-xs font-medium text-muted shadow-sm backdrop-blur">
                <Layers className="size-3.5 text-primary" aria-hidden />
                Tu primer paso
              </p>
              <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Aún no tienes publicaciones
              </h3>
              <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
                Cuenta qué sabes hacer, en cuánto tiempo y a qué precio. Una buena ficha ayuda a que
                los clientes te elijan antes que a la competencia.
              </p>
            </div>
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button
                variant="primary"
                className="h-12 rounded-full bg-gradient-to-r from-primary to-primary-light px-6 text-sm font-semibold text-white shadow-md shadow-primary/20"
                onPress={() => router.push("/skills/new")}
              >
                <span className="inline-flex items-center gap-2">
                  Publicar habilidad
                  <ArrowRight className="size-4 shrink-0" aria-hidden />
                </span>
              </Button>
              <Link
                href="/explorar"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-6 text-sm font-semibold text-foreground no-underline transition hover:bg-surface-elevated"
              >
                Ver ejemplos en Explorar
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-2">
            {FILTERS.map((item) => {
              const active = filter === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "border border-border bg-white text-muted hover:border-primary/35 hover:text-primary"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface-elevated px-6 py-10 text-center">
              <p className="text-sm font-medium text-foreground">
                No hay publicaciones para este filtro
              </p>
              <p className="mt-1 text-sm text-muted">
                Cambia de categoría o crea una nueva publicación.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  hideFavorite
                  showActiveStatus
                  onEdit={(item) => router.push(`/skills/${item.id}/edit`)}
                  onPause={async (item) => {
                    await pauseSkill(item.id);
                    await reload();
                  }}
                  onPublish={async (item) => {
                    await publishSkill(item.id);
                    await reload();
                  }}
                  onReactivate={async (item) => {
                    await reactivateSkill(item.id);
                    await reload();
                  }}
                  onDelete={(item) => setDeleting(item)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <Modal.Backdrop isDismissable className="bg-primary-dark/45 backdrop-blur-[2px]">
          <Modal.Container placement="center" size="sm">
            <Modal.Dialog className="rounded-2xl border border-border bg-white p-0 shadow-xl">
              <Modal.Header className="border-b border-border px-5 py-4">
                <Modal.Heading className="text-lg font-bold text-foreground">
                  ¿Eliminar esta habilidad?
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="px-5 py-4">
                <p className="text-sm text-muted">
                  Se perderán todos los datos. Esta acción no se puede deshacer.
                </p>
              </Modal.Body>
              <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
                <Button
                  variant="outline"
                  className="rounded-full border-border px-5"
                  onPress={() => setDeleting(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  className="rounded-full bg-accent-red px-5 text-white hover:opacity-95"
                  isDisabled={isDeleting}
                  onPress={async () => {
                    if (!deleting) return;
                    setIsDeleting(true);
                    try {
                      await deleteSkill(deleting.id);
                      setDeleting(null);
                      await reload();
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                >
                  Eliminar
                </Button>
              </div>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
