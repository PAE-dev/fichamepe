import type { ServiceStatus } from "@/types/service.types";

export const SKILL_WIZARD_STEPS = ["Lo básico", "Los detalles", "Vista previa"] as const;
export const MAX_TITLE_LENGTH = 80;
export const MAX_DESCRIPTION_LENGTH = 600;
export const MIN_DESCRIPTION_LENGTH = 80;
export const DESCRIPTION_QUALITY_THRESHOLD = 150;
export const MAX_TAGS = 5;
export const MAX_TAG_LENGTH = 20;
export const MIN_PRICE = 5;

export const SKILL_CATEGORIES = [
  { id: "tech", label: "Tecnología" },
  { id: "design", label: "Diseño" },
  { id: "content", label: "Contenido & Redes" },
  { id: "language", label: "Idiomas" },
  { id: "entertainment", label: "Entretenimiento" },
  { id: "advice", label: "Asesoría & Opinión" },
  { id: "lifestyle", label: "Estilo de vida" },
  { id: "other", label: "Otro" },
] as const;

export const TAG_SUGGESTIONS_BY_CATEGORY: Record<string, string[]> = {
  tech: ["web", "apps", "automatización", "IA", "soporte", "código"],
  design: ["logo", "branding", "redes", "flyer", "presentación", "UI"],
  content: ["instagram", "tiktok", "captions", "reels", "comunidad", "engagement"],
  language: ["inglés", "traducción", "corrección", "pronunciación", "conversación"],
  entertainment: ["humor", "stand-up", "música", "juegos", "trivia", "historias"],
  advice: ["opinión", "feedback", "coaching", "mentoría", "negocios", "personal"],
  lifestyle: ["fitness", "recetas", "moda", "decoración", "mindfulness", "organización"],
  other: [],
};

export const DELIVERY_MODES = [
  { id: "digital", label: "100% Digital" },
  { id: "videocall", label: "Videollamada" },
  { id: "chat", label: "Por chat / mensajes" },
  { id: "presencial", label: "Presencial" },
] as const;

export const DELIVERY_TIMES = [
  "Mismo día",
  "1-2 días",
  "3-5 días",
  "1 semana",
  "2 semanas",
  "A coordinar",
] as const;

export const REVISION_OPTIONS = ["0", "1", "2", "3", "Ilimitadas"] as const;

export const DEFAULT_WIZARD_STATUS: ServiceStatus = "BORRADOR";
