"use client";

import { Timer } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";

export function CountdownTimer({
  endsAt,
  /** Sobre imagen de portada: texto oscuro sobre chip blanco. */
  overlay = false,
}: {
  endsAt: string | null | undefined;
  overlay?: boolean;
}) {
  const { hours, minutes, seconds, isExpired } = useCountdown(endsAt);

  if (isExpired) return null;

  const danger = hours < 1;
  if (overlay) {
    const chip =
      "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.22)] backdrop-blur-sm";
    return (
      <div
        className={
          danger
            ? `${chip} border-accent-red/30 bg-white/95 text-accent-red [&>svg]:text-accent-red`
            : `${chip} border-primary/30 bg-white/95 text-primary-dark [&>svg]:text-primary`
        }
      >
        <Timer className="size-3.5 shrink-0" aria-hidden />
        {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>
    );
  }
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
        danger ? "bg-accent-red/10 text-accent-red" : "bg-accent/10 text-accent"
      }`}
    >
      <Timer className="size-3.5" aria-hidden />
      {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}
