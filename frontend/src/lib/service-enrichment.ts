import type { ServicePublic } from "@/types/service.types";

/** Enriquece datos del API con campos de UI usados en tarjetas (sin `server-only`). */
export function enrichService(service: ServicePublic): ServicePublic {
  const hash = service.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const generatedRating = 4.2 + (hash % 7) * 0.1;
  const generatedReviews = 20 + (hash % 140);

  const badgeByOrder: NonNullable<ServicePublic["badge"]>[] = [
    "bestSeller",
    "fastResponse",
    "new",
    "topRated",
    "premium",
  ];

  return {
    ...service,
    previousPrice:
      service.previousPrice ??
      (service.price != null ? Math.round(service.price * (1.2 + (hash % 2) * 0.1)) : null),
    badge: service.badge ?? badgeByOrder[hash % badgeByOrder.length],
    weeklyHires: service.weeklyHires ?? 9 + (hash % 35),
    etaHours: service.etaHours ?? 12 + (hash % 3) * 12,
    remainingSlots: service.remainingSlots ?? Math.max(1, 8 - (hash % 7)),
    soldRatio: service.soldRatio ?? 0.56 + (hash % 4) * 0.1,
    flashDealEndsAt:
      service.flashDealEndsAt ?? new Date(Date.now() + (hash % 5 + 1) * 3_600_000).toISOString(),
    testimonial: service.testimonial ?? "Atencion buena y entrega puntual.",
    distanceKm: service.distanceKm ?? 1.5 + (hash % 8),
    profile: service.profile
      ? {
          ...service.profile,
          rating: service.profile.rating ?? Number(generatedRating.toFixed(1)),
          reviewCount: service.profile.reviewCount ?? generatedReviews,
          responseTimeHours: service.profile.responseTimeHours ?? 1 + (hash % 4),
          isVerified: service.profile.isVerified ?? hash % 2 === 0,
        }
      : undefined,
  };
}
