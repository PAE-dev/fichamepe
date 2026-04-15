"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MessageSquareWarning } from "lucide-react";
import { Button } from "@heroui/react/button";
import { Modal } from "@heroui/react/modal";
import { SKILL_CATEGORIES } from "@/components/skills/skill-wizard.constants";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import {
  approveAdminService,
  fetchAdminReviewQueue,
  requestAdminServiceChanges,
} from "@/lib/api/admin-services.api";
import { isActivePromo } from "@/lib/service-promo";
import type { ServicePublic, ServiceStatus } from "@/types/service.types";

function adminStatusPill(status: ServiceStatus): { label: string; className: string } {
  switch (status) {
    case "EN_REVISION":
      return {
        label: "En revisión",
        className: "bg-primary/12 text-primary ring-1 ring-primary/30",
      };
    case "REQUIERE_CAMBIOS":
      return {
        label: "Requiere cambios",
        className: "bg-accent-red/10 text-accent-red ring-1 ring-accent-red/25",
      };
    case "ACTIVA":
      return {
        label: "Activa",
        className: "bg-success/10 text-success ring-1 ring-success/25",
      };
    case "PAUSADA":
      return {
        label: "Pausada",
        className: "bg-muted/30 text-muted ring-1 ring-border",
      };
    default:
      return {
        label: "Borrador",
        className: "bg-surface-elevated text-muted ring-1 ring-border",
      };
  }
}

export function DashboardAdminClient() {
  const [items, setItems] = useState<ServicePublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<ServicePublic | null>(null);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const reload = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const queue = await fetchAdminReviewQueue();
      setItems(queue);
      if (!selectedId && queue.length > 0) {
        setSelectedId(queue[0]?.id ?? null);
      }
      if (selectedId && !queue.some((item) => item.id === selectedId)) {
        setSelectedId(queue[0]?.id ?? null);
      }
    } catch {
      setItems([]);
      setLoadError("No pudimos cargar la cola de revisión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approveSelected = async (service: ServicePublic) => {
    setBusyId(service.id);
    try {
      await approveAdminService(service.id);
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  const rejectSelected = async () => {
    if (!rejecting) return;
    const feedback = comment.trim();
    if (feedback.length < 10) {
      setCommentError("Escribe al menos 10 caracteres para guiar la corrección.");
      return;
    }
    setCommentError(null);
    setBusyId(rejecting.id);
    try {
      await requestAdminServiceChanges(rejecting.id, feedback);
      setRejecting(null);
      setComment("");
      await reload();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Administración</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Revisión de publicaciones
        </h1>
        <p className="text-sm text-muted">
          Aprueba publicaciones listas o devuelve con observaciones claras para mejorar su calidad.
        </p>
      </header>

      {loadError ? (
        <div className="rounded-2xl border border-border bg-surface-elevated px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">{loadError}</p>
          <Button
            variant="primary"
            className="mt-5 rounded-full bg-primary px-6 text-white"
            onPress={() => void reload()}
          >
            Reintentar
          </Button>
        </div>
      ) : null}

      {!loadError ? (
        <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-2xl border border-border bg-white p-3">
            <div className="mb-3 flex items-center justify-between px-2">
              <p className="text-sm font-semibold text-foreground">Pendientes</p>
              <p className="text-xs font-semibold text-muted">{items.length}</p>
            </div>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="h-16 animate-pulse rounded-xl bg-surface-elevated" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface-elevated px-4 py-8 text-center">
                <p className="text-sm font-medium text-foreground">No hay publicaciones en revisión</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => {
                  const active = item.id === selectedId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                        active
                          ? "border-primary/35 bg-primary/10"
                          : "border-border bg-white hover:border-primary/25 hover:bg-primary/[0.04]"
                      }`}
                    >
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="line-clamp-1 text-xs text-muted">
                        {item.profile?.displayName ?? "Sin perfil"}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="flex min-h-[min(70vh,640px)] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            {!selected ? (
              <div className="flex min-h-[300px] flex-1 items-center justify-center px-6 text-sm text-muted">
                Selecciona una publicación para revisar sus detalles.
              </div>
            ) : (
              <>
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/25 via-primary/10 to-surface-elevated">
                  {selected.coverImageUrl ? (
                    <Image
                      src={selected.coverImageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, min(900px, 65vw)"
                      priority
                    />
                  ) : (
                    <div className="flex h-full min-h-[160px] w-full flex-col items-center justify-center gap-2 px-6 text-center">
                      <span className="text-sm font-medium text-muted">Sin imagen de portada</span>
                      <span className="max-w-sm text-xs text-muted/80">
                        Pide una portada clara si el servicio lo requiere para evaluar la publicación.
                      </span>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
                  {isActivePromo(selected) ? (
                    <div className="absolute bottom-3 right-3 z-[1]">
                      <CountdownTimer endsAt={selected.flashDealEndsAt} overlay />
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-1 flex-col gap-5 p-5 pb-4 lg:pb-6">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Publicación en revisión
                    </p>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h2 className="max-w-[min(100%,52rem)] text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                        {selected.title}
                      </h2>
                      {(() => {
                        const pill = adminStatusPill(selected.status);
                        return (
                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${pill.className}`}
                          >
                            {pill.label}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                      {selected.profile?.avatarUrl ? (
                        <span className="relative size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
                          <Image
                            src={selected.profile.avatarUrl}
                            alt=""
                            width={36}
                            height={36}
                            className="size-full object-cover"
                          />
                        </span>
                      ) : null}
                      <span>
                        <span className="font-medium text-foreground/80">Autor:</span>{" "}
                        {selected.profile?.displayName ?? "Sin nombre"}
                        <span className="mx-1.5 text-border">·</span>
                        <span className="font-medium text-foreground/80">Enviada:</span>{" "}
                        {selected.submittedAt
                          ? new Date(selected.submittedAt).toLocaleString("es-PE")
                          : "sin fecha"}
                      </span>
                    </div>
                  </div>

                  {selected.moderationComment ? (
                    <div className="flex gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
                      <MessageSquareWarning
                        className="mt-0.5 size-5 shrink-0 text-accent"
                        aria-hidden
                      />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                          Comentario previo
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                          {selected.moderationComment}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      Detalle del servicio
                    </p>
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border/80 bg-surface-elevated/60 px-3 py-2.5">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Categoría
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-foreground">
                          {SKILL_CATEGORIES.find((c) => c.id === selected.category)?.label ??
                            selected.category}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-border/80 bg-surface-elevated/60 px-3 py-2.5">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Modalidad
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-foreground">
                          {selected.deliveryMode}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-border/80 bg-surface-elevated/60 px-3 py-2.5">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Plazo de entrega
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-foreground">
                          {selected.deliveryTime}
                        </dd>
                      </div>
                      <div className="rounded-xl border border-border/80 bg-surface-elevated/60 px-3 py-2.5">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-muted">
                          Revisiones incluidas
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-foreground">
                          {selected.revisionsIncluded}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      Descripción
                    </p>
                    <div className="max-h-56 overflow-y-auto rounded-xl border border-border bg-surface-elevated/50 px-4 py-3 text-sm leading-relaxed text-foreground/90 shadow-inner">
                      {selected.description}
                    </div>
                  </div>

                  {selected.tags.length > 0 ? (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                        Etiquetas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selected.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-border bg-surface-elevated/40 px-4 py-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      Precio
                    </p>
                    {isActivePromo(selected) && selected.flashDealEndsAt ? (
                      <div className="mb-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted">
                        <span>
                          Oferta vigente hasta{" "}
                          <span className="font-medium text-foreground">
                            {new Date(selected.flashDealEndsAt).toLocaleString("es-PE")}
                          </span>
                        </span>
                        <span aria-hidden className="text-border">
                          ·
                        </span>
                        <CountdownTimer endsAt={selected.flashDealEndsAt} />
                      </div>
                    ) : null}
                    <PriceDisplay
                      variant="card"
                      price={selected.price}
                      previousPrice={selected.previousPrice}
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 z-10 mt-auto flex flex-wrap justify-end gap-2 border-t border-border bg-white/95 px-5 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-sm supports-[backdrop-filter]:bg-white/85">
                  <Button
                    variant="outline"
                    className="rounded-full border-accent-red/40 text-accent-red"
                    isDisabled={busyId === selected.id}
                    onPress={() => {
                      setRejecting(selected);
                      setComment(selected.moderationComment ?? "");
                      setCommentError(null);
                    }}
                  >
                    Solicitar cambios
                  </Button>
                  <Button
                    variant="primary"
                    className="rounded-full bg-primary px-6 text-white"
                    isDisabled={busyId === selected.id}
                    onPress={() => void approveSelected(selected)}
                  >
                    Aprobar publicación
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>
      ) : null}

      <Modal isOpen={!!rejecting} onOpenChange={(open) => !open && setRejecting(null)}>
        <Modal.Trigger className="sr-only" aria-label="Abrir correcciones">
          Abrir
        </Modal.Trigger>
        <Modal.Backdrop isDismissable className="bg-primary-dark/45 backdrop-blur-[2px]">
          <Modal.Container placement="center" size="lg">
            <Modal.Dialog className="rounded-2xl border border-border bg-white p-0 shadow-xl">
              <Modal.Header className="border-b border-border px-5 py-4">
                <Modal.Heading className="text-lg font-bold text-foreground">
                  Solicitar correcciones
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="space-y-3 px-5 py-4">
                <p className="text-sm text-muted">
                  Explica al propietario qué debe mejorar para que la publicación pueda aprobarse.
                </p>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/20"
                  placeholder="Ejemplo: agrega más detalle del entregable, tiempo realista y una portada más clara."
                />
                {commentError ? (
                  <p className="text-xs font-medium text-accent-red">{commentError}</p>
                ) : null}
              </Modal.Body>
              <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
                <Button
                  variant="outline"
                  className="rounded-full border-border px-5"
                  onPress={() => setRejecting(null)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  className="rounded-full bg-accent-red px-5 text-white hover:opacity-95"
                  isDisabled={!rejecting || busyId === rejecting.id}
                  onPress={() => void rejectSelected()}
                >
                  Enviar observaciones
                </Button>
              </div>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
