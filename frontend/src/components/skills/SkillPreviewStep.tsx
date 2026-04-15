"use client";

import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import type { ServicePublic } from "@/types/service.types";
import { DESCRIPTION_QUALITY_THRESHOLD, MIN_DESCRIPTION_LENGTH } from "./skill-wizard.constants";
import type { SkillWizardFormData } from "./skill-wizard.types";

type SkillPreviewStepProps = {
  data: SkillWizardFormData;
  previewService: ServicePublic;
};

function Item({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 text-sm ${ok ? "text-foreground" : "text-muted"}`}>
      {ok ? (
        <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
      ) : (
        <AlertTriangle className="size-4 shrink-0 text-accent" aria-hidden />
      )}
      {label}
    </li>
  );
}

function DescriptionQualityItem({ len }: { len: number }) {
  const okStrong = len >= DESCRIPTION_QUALITY_THRESHOLD;
  const okMin = len >= MIN_DESCRIPTION_LENGTH;
  if (okStrong) {
    return (
      <li className="flex items-center gap-2 text-sm text-foreground">
        <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
        Descripción (más de 150 caracteres)
      </li>
    );
  }
  if (okMin) {
    return (
      <li className="flex items-center gap-2 text-sm text-foreground">
        <AlertTriangle className="size-4 shrink-0 text-accent" aria-hidden />
        Descripción (recomendamos más de 150 caracteres)
      </li>
    );
  }
  return (
    <li className="flex items-center gap-2 text-sm text-muted">
      <XCircle className="size-4 shrink-0 text-accent-red" aria-hidden />
      Descripción (mínimo 80 caracteres)
    </li>
  );
}

export function SkillPreviewStep({ data, previewService }: SkillPreviewStepProps) {
  const descLen = data.description.trim().length;

  return (
    <section className="space-y-6">
      <div className="w-full max-w-[360px] sm:max-w-[420px]">
        <ServiceCard service={previewService} hideFavorite />
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-foreground">Checklist de calidad</p>
        <ul className="space-y-2">
          <Item ok={data.title.trim().length > 0} label="Título descriptivo" />
          <Item ok={!!data.category} label="Categoría seleccionada" />
          <DescriptionQualityItem len={descLen} />
          <Item ok={Number(data.price) > 0} label="Precio definido" />
          <Item ok={!!data.deliveryMode} label="Modalidad de entrega" />
        </ul>
      </div>
    </section>
  );
}
