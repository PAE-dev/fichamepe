"use client";

import { Star } from "lucide-react";

export function ReviewStarsDisplay({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const r = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className ?? ""}`}
      role="img"
      aria-label={`${r} de 5 estrellas`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-4 shrink-0 ${
            i <= r ? "fill-foreground text-foreground" : "fill-transparent text-border"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}
