"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";
import { ServiceCard } from "@/components/cards/ServiceCard";
import type { ServicePublic } from "@/types/service.types";
import { DESCRIPTION_QUALITY_THRESHOLD } from "./skill-wizard.constants";
import type { SkillWizardFormData } from "./skill-wizard.types";
import { validatePromoFields } from "./skill-wizard.validation";

type SkillPreviewStepProps = {
  data: SkillWizardFormData;
  previewService: ServicePublic;
};

function Item({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 text-sm ${ok ? "text-foreground" : "text-muted"}`}>
      {ok ? (
        <CheckCircle2 className="size-4 text-success" aria-hidden />
      ) : (
        <AlertTriangle className="size-4 text-accent" aria-hidden />
      )}
      {label}
    </li>
  );
}

export function SkillPreviewStep({ data, previewService }: SkillPreviewStepProps) {
  const descriptionQualityOk = data.description.trim().length >= DESCRIPTION_QUALITY_THRESHOLD;
  const promoErr = validatePromoFields(data);
  const promoOk =
    !data.promoEnabled || (!promoErr.listPrice && !promoErr.promoEndsAtLocal);

  return (
    <section className="space-y-6">
      <div className="w-full max-w-[360px] sm:max-w-[420px]">
        <ServiceCard service={previewService} hideFavorite />
      </div>
      <div className="rounded-2xl border border-border bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">Checklist de calidad</p>
        <ul className="space-y-2">
          <Item ok={data.title.trim().length > 0} label="Título descriptivo" />
          <Item ok={!!data.category} label="Categoría seleccionada" />
          <Item
            ok={descriptionQualityOk}
            label={
              descriptionQualityOk
                ? "Descripción completa (+150 caracteres)"
                : "Descripción corta (recomendado +150 caracteres)"
            }
          />
          <Item ok={Number(data.price) > 0} label="Precio definido" />
          <Item ok={!!data.deliveryMode} label="Modalidad de entrega" />
          <Item
            ok={promoOk}
            label={
              data.promoEnabled
                ? "Oferta: precio normal, precio en oferta y fecha de fin"
                : "Oferta por tiempo limitado (opcional, desactivada)"
            }
          />
        </ul>
      </div>
    </section>
  );
}
