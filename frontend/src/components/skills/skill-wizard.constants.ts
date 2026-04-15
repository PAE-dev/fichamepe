import type { LucideIcon } from "lucide-react";
import {
  Clapperboard,
  Globe2,
  Laptop,
  MapPin,
  MessageSquare,
  Palette,
  Smartphone,
  SunMedium,
  Tag,
  Upload,
  Video,
} from "lucide-react";
import type { ServiceStatus } from "@/types/service.types";

export const SKILL_WIZARD_STEPS = ["Lo básico", "Los detalles", "Vista previa"] as const;
export const MAX_TITLE_LENGTH = 80;
export const MAX_DESCRIPTION_LENGTH = 600;
export const MIN_DESCRIPTION_LENGTH = 80;
export const DESCRIPTION_QUALITY_THRESHOLD = 150;
export const MAX_TAGS = 5;
export const MAX_TAG_LENGTH = 20;
export const MIN_PRICE = 5;

export const SKILL_CATEGORIES: ReadonlyArray<{
  id: string;
  label: string;
  Icon: LucideIcon;
}> = [
  { id: "tech", label: "Tecnología", Icon: Laptop },
  { id: "design", label: "Diseño", Icon: Palette },
  { id: "content", label: "Contenido & Redes", Icon: Smartphone },
  { id: "language", label: "Idiomas", Icon: Globe2 },
  { id: "entertainment", label: "Entretenimiento", Icon: Clapperboard },
  { id: "advice", label: "Asesoría & Opinión", Icon: MessageSquare },
  { id: "lifestyle", label: "Estilo de vida", Icon: SunMedium },
  { id: "other", label: "Otro", Icon: Tag },
];

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

export const DELIVERY_MODES: ReadonlyArray<{
  id: string;
  label: string;
  Icon: LucideIcon;
}> = [
  { id: "digital", label: "100% Digital", Icon: Upload },
  { id: "videocall", label: "Videollamada", Icon: Video },
  { id: "chat", label: "Por chat / mensajes", Icon: MessageSquare },
  { id: "presencial", label: "Presencial", Icon: MapPin },
];

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
