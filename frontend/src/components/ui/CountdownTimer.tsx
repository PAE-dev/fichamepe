"use client";

import { Timer } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";

export function CountdownTimer({ endsAt }: { endsAt: string | null | undefined }) {
  const { hours, minutes, seconds, isExpired } = useCountdown(endsAt);

  if (isExpired) return null;

  const danger = hours < 1;
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
