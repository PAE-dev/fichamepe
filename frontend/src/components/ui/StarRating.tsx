import { Star } from "lucide-react";

export function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="inline-flex items-center gap-1 text-xs text-muted">
      <Star className="size-3.5 fill-accent text-accent" aria-hidden />
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      <span>({reviewCount} reseñas)</span>
    </div>
  );
}
