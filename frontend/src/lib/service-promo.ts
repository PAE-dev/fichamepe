import type { ServicePublic } from "@/types/service.types";

/** Promo vigente: precio de referencia mayor al vigente y fecha de fin en el futuro. */
export function isActivePromo(
  service: Pick<ServicePublic, "price" | "previousPrice" | "flashDealEndsAt">,
): boolean {
  const list = service.previousPrice;
  const price = service.price;
  const ends = service.flashDealEndsAt;
  if (list == null || price == null || ends == null) return false;
  if (!(list > price)) return false;
  const t = new Date(ends).getTime();
  if (!Number.isFinite(t)) return false;
  return t > Date.now();
}
