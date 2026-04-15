import { BadRequestException } from '@nestjs/common';

export type PromoFieldsInput = {
  price: number | null | undefined;
  listPrice: number | null | undefined;
  promoEndsAt: Date | null | undefined;
};

export type AssertTimedPromoOptions = {
  /** Si true, una promo ya vencida en BD no bloquea otros campos (solo creación/edición de promo activa valida fecha futura). */
  allowExpiredPersisted?: boolean;
};

/**
 * Reglas: sin promo si listPrice y promoEndsAt son ambos null/undefined.
 * Con promo activa (fin en el futuro): ambos definidos, listPrice > price, price numérico.
 */
export function assertTimedPromoValid(
  input: PromoFieldsInput,
  options?: AssertTimedPromoOptions,
): void {
  const { price, listPrice, promoEndsAt } = input;
  const hasList = listPrice != null;
  const hasEnd = promoEndsAt != null;

  if (!hasList && !hasEnd) {
    return;
  }

  if (hasList !== hasEnd) {
    throw new BadRequestException(
      'La oferta requiere precio habitual (listPrice) y fecha de fin (promoEndsAt), o ambos vacíos para quitarla.',
    );
  }

  const endMs = promoEndsAt!.getTime();
  if (!Number.isFinite(endMs)) {
    throw new BadRequestException('La fecha de fin de la oferta no es válida.');
  }

  if (endMs <= Date.now()) {
    if (options?.allowExpiredPersisted) {
      return;
    }
    throw new BadRequestException(
      'La oferta debe terminar en el futuro (ajusta la fecha u hora).',
    );
  }

  if (price == null || typeof price !== 'number' || Number.isNaN(price)) {
    throw new BadRequestException(
      'Para una oferta por tiempo limitado necesitas un precio de oferta (price) válido.',
    );
  }

  if (listPrice! <= price) {
    throw new BadRequestException(
      'El precio habitual debe ser mayor que el precio de la oferta.',
    );
  }
}
