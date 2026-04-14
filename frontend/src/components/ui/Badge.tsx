import { Sparkles, Timer, Trophy, Zap } from "lucide-react";
import type { ServiceBadgeKey } from "@/types/service.types";

const BADGE_MAP: Record<
  ServiceBadgeKey,
  { label: string; className: string; Icon: typeof Sparkles }
> = {
  bestSeller: {
    label: "Mas vendido",
    className: "bg-accent/15 text-accent",
    Icon: Sparkles,
  },
  fastResponse: {
    label: "Responde rapido",
    className: "bg-success/15 text-success",
    Icon: Zap,
  },
  new: {
    label: "Nuevo",
    className: "bg-primary/10 text-primary",
    Icon: Timer,
  },
  premium: {
    label: "Premium",
    className: "bg-primary-dark/15 text-primary-dark",
    Icon: Trophy,
  },
  topRated: {
    label: "Top rated",
    className: "bg-primary-light/15 text-primary-dark",
    Icon: Trophy,
  },
};

export function Badge({ badge }: { badge: ServiceBadgeKey }) {
  const config = BADGE_MAP[badge];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${config.className}`}
    >
      <config.Icon className="size-3.5" aria-hidden />
      {config.label}
    </span>
  );
}
