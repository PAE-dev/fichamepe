"use client";

import { Type } from "lucide-react";
import { Input } from "@heroui/react/input";
import { Label } from "@heroui/react/label";
import { CategoryCardGrid } from "./CategoryCardGrid";
import { TagInputWithSuggestions } from "./TagInputWithSuggestions";
import { MAX_TITLE_LENGTH } from "./skill-wizard.constants";
import { wizardSectionClass, wizardTextFieldClass } from "./skill-wizard.ui";
import type { SkillWizardErrors, SkillWizardFormData } from "./skill-wizard.types";

type SkillBasicStepProps = {
  data: SkillWizardFormData;
  errors: SkillWizardErrors;
  onFieldChange: <K extends keyof SkillWizardFormData>(field: K, value: SkillWizardFormData[K]) => void;
  onFieldBlur: (field: keyof SkillWizardFormData) => void;
};

export function SkillBasicStep({ data, errors, onFieldChange, onFieldBlur }: SkillBasicStepProps) {
  return (
    <section className="space-y-8">
      <div className={wizardSectionClass}>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Type className="size-4" strokeWidth={2} aria-hidden />
          </span>
          <div>
            <Label htmlFor="skill-title" className="text-base font-bold tracking-tight text-foreground">
              Título del servicio
            </Label>
            <p className="mt-0.5 text-xs text-muted">Paso 1 · Lo básico</p>
          </div>
        </div>
        <Input
          id="skill-title"
          aria-labelledby="skill-title-label"
          value={data.title}
          onChange={(event) => onFieldChange("title", event.target.value.slice(0, MAX_TITLE_LENGTH))}
          onBlur={() => onFieldBlur("title")}
          placeholder="Ej: Diseño 3 posts para tu Instagram"
          className={`${wizardTextFieldClass} ${
            errors.title
              ? "border-accent-red focus-visible:border-accent-red focus-visible:ring-accent-red/20"
              : ""
          }`}
        />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
          <p className="max-w-xl text-xs leading-relaxed text-muted sm:text-[13px]">
            Sé específico. Los mejores títulos describen exactamente qué recibirá el comprador.
          </p>
          <p className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-primary">
            {data.title.length}/{MAX_TITLE_LENGTH}
          </p>
        </div>
        {errors.title ? <p className="mt-2 text-xs font-medium text-accent-red">{errors.title}</p> : null}
      </div>

      <div className={wizardSectionClass}>
        <div className="mb-3">
          <p className="text-base font-bold tracking-tight text-foreground">Categoría principal</p>
          <p className="mt-0.5 text-xs text-muted">Elige una opción (obligatorio)</p>
        </div>
        <CategoryCardGrid
          value={data.category}
          onChange={(value) => onFieldChange("category", value)}
          onBlur={() => onFieldBlur("category")}
          error={errors.category}
        />
      </div>

      <div className={wizardSectionClass}>
        <div className="mb-3">
          <Label className="text-base font-bold tracking-tight text-foreground">Etiquetas (opcional)</Label>
          <p className="mt-1 text-xs leading-relaxed text-muted sm:text-[13px]">
            Ayuda a que te encuentren. Ej: instagram, humor, branding
          </p>
        </div>
        <TagInputWithSuggestions
          category={data.category}
          tags={data.tags}
          onChange={(next) => onFieldChange("tags", next)}
          onBlur={() => onFieldBlur("tags")}
          error={errors.tags}
        />
      </div>
    </section>
  );
}
