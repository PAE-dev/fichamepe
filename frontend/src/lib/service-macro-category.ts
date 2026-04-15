import { HOME_MACRO_CATEGORIES, type MacroCategorySlug } from "@/lib/constants";
import type { ServicePublic } from "@/types/service.types";

/** Categoría del wizard de habilidades → pestaña macro de la home / explorar. */
const WIZARD_TO_MACRO: Record<string, MacroCategorySlug> = {
  tech: "programacion",
  design: "diseno",
  content: "marketing",
  language: "idiomas",
  advice: "otros",
  lifestyle: "otros",
  other: "otros",
};

export function macroSlugForWizardCategory(cat: string): MacroCategorySlug {
  const key = (cat || "").trim();
  return WIZARD_TO_MACRO[key] ?? "otros";
}

/**
 * Asigna un servicio a una macro-categoría (navegación home / filtros explorar).
 * Prioriza `service.category` del backend; si falta, heurística por etiquetas/título.
 */
export function macroSlugForService(service: ServicePublic): MacroCategorySlug {
  const cat = (service.category || "").trim();

  if (cat === "entertainment") {
    const t = `${service.tags.join(" ")} ${service.title}`.toLowerCase();
    if (
      t.includes("música") ||
      t.includes("musica") ||
      t.includes("cantante") ||
      t.includes("instrumento")
    ) {
      return "musica";
    }
    return "entretenimiento";
  }

  const mapped = WIZARD_TO_MACRO[cat];
  if (mapped) return mapped;

  const norm = `${service.tags.join(" ")} ${service.title}`.toLowerCase();
  for (const macro of HOME_MACRO_CATEGORIES) {
    const hint = macro.label.toLowerCase().split(/\s+/)[0];
    if (hint && norm.includes(hint)) return macro.slug;
  }
  return "otros";
}

export function serviceMatchesMacroSlug(
  service: ServicePublic,
  slug: MacroCategorySlug,
): boolean {
  return macroSlugForService(service) === slug;
}
