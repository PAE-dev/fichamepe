-- Oferta por tiempo limitado: precio de referencia + fin de promoción.
-- psql ... -f migrations/0009-service-promo.sql

ALTER TABLE "service" ADD COLUMN IF NOT EXISTS "listPrice" numeric(10, 2) NULL;
ALTER TABLE "service" ADD COLUMN IF NOT EXISTS "promoEndsAt" timestamptz NULL;
