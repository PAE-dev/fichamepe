"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, Copy, MessageCircle, Share2 } from "lucide-react";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import {
  createServiceReport,
  type ServiceReportReason,
} from "@/lib/api/service-reports.api";
import { useAuthModals } from "@/components/auth/auth-modals-context";
import { useAuthStore } from "@/store/auth.store";
import { useConversationsStore } from "@/stores/conversationsStore";

const REPORT_REASON_OPTIONS: Array<{ value: ServiceReportReason; label: string }> = [
  { value: "fraud", label: "Posible estafa o cobro engañoso" },
  { value: "inappropriate_content", label: "Contenido inapropiado" },
  { value: "false_information", label: "Información falsa del servicio" },
  { value: "spam", label: "Spam o publicación repetida" },
  { value: "other", label: "Otro motivo" },
];

type ServiceDetailActionsProps = {
  service: {
    id: string;
    title: string;
    userId: string;
    coverImageUrl?: string | null;
    price?: number | null;
    previousPrice?: number | null;
    category?: string;
    tags?: string[];
    deliveryTime?: string;
    profile?: {
      displayName: string;
      avatarUrl: string | null;
    };
  };
};

export function ServiceDetailActions({ service }: ServiceDetailActionsProps) {
  const router = useRouter();
  const { openLogin } = useAuthModals();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openOrCreateConversationFromService = useConversationsStore(
    (state) => state.openOrCreateConversationFromService,
  );
  const [isCopied, setIsCopied] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState<ServiceReportReason>("fraud");
  const [details, setDetails] = useState("");
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const [reporting, setReporting] = useState(false);
  const participantName = service.profile?.displayName ?? "Freelancer";

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return `/servicios/${service.id}`;
    return window.location.href;
  }, [service.id]);

  const handleContact = () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    openOrCreateConversationFromService({
      serviceId: service.id,
      serviceTitle: service.title,
      serviceCoverImageUrl: service.coverImageUrl ?? null,
      servicePrice: service.price ?? null,
      servicePreviousPrice: service.previousPrice ?? null,
      serviceCategory: service.tags?.[0] ?? service.category ?? null,
      serviceDeliveryTime: service.deliveryTime ?? null,
      participant: {
        id: service.userId,
        fullName: participantName,
        avatarUrl: service.profile?.avatarUrl ?? null,
      },
    });
    router.push("/conversaciones?vista=consultas");
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: service.title,
          text: `Te recomiendo este servicio en fichame.pe: ${service.title}`,
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      // Evita romper la UI si el usuario cancela el share modal nativo.
    }
  };

  const openReportModal = () => {
    if (!isAuthenticated) {
      openLogin();
      return;
    }
    setReportSuccess(null);
    setReportError(null);
    setReportOpen(true);
  };

  const submitReport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReporting(true);
    setReportError(null);
    try {
      await createServiceReport({
        serviceId: service.id,
        reason,
        details: details.trim() ? details.trim() : undefined,
      });
      setReportOpen(false);
      setDetails("");
      setReason("fraud");
      setReportSuccess("Gracias. Tu reporte fue enviado al equipo de revisión.");
    } catch {
      setReportError("No pudimos enviar el reporte. Inténtalo nuevamente.");
    } finally {
      setReporting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleContact}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
        >
          <MessageCircle className="size-4" aria-hidden />
          Contactar
        </button>
        <FavoriteButton serviceId={service.id} />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
        >
          {isCopied ? <Check className="size-3.5" aria-hidden /> : <Share2 className="size-3.5" aria-hidden />}
          {isCopied ? "Copiado" : "Recomendar"}
        </button>
        <button
          type="button"
          onClick={openReportModal}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-medium text-foreground transition hover:border-accent-red/40 hover:text-accent-red"
        >
          <AlertTriangle className="size-3.5" aria-hidden />
          Reportar
        </button>
      </div>

      <p className="mt-3 text-xs text-muted">
        Al contactar, se abrirá una conversación directa con {participantName}.
      </p>
      {reportSuccess ? (
        <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-success">
          <Check className="size-3.5" aria-hidden />
          {reportSuccess}
        </p>
      ) : null}

      {reportOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Reportar publicación</h3>
                <p className="mt-1 text-sm text-muted">
                  Cuéntanos qué ocurrió para revisar este anuncio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="inline-flex size-8 items-center justify-center rounded-full border border-border text-muted transition hover:border-primary/40 hover:text-primary"
                aria-label="Cerrar reporte"
              >
                ×
              </button>
            </div>

            <form className="mt-4 space-y-4" onSubmit={submitReport}>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-foreground">Motivo</legend>
                {REPORT_REASON_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-2.5 text-sm text-foreground transition hover:border-primary/35"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={option.value}
                      checked={reason === option.value}
                      onChange={() => setReason(option.value)}
                      className="mt-0.5 accent-primary"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </fieldset>

              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Detalle adicional (opcional)
                </span>
                <textarea
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  maxLength={800}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                  placeholder="Describe brevemente qué pasó..."
                />
                <span className="mt-1 block text-right text-xs text-muted">
                  {details.length}/800
                </span>
              </label>

              {reportError ? <p className="text-sm text-accent-red">{reportError}</p> : null}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportOpen(false)}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-primary/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={reporting}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reporting ? (
                    <>
                      <Copy className="size-3.5 animate-pulse" aria-hidden />
                      Enviando...
                    </>
                  ) : (
                    "Enviar reporte"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
