-- Cupos explícitos por referidos (tope en app), slots comprados y auditoría de compras.

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "referralSlotsEarned" integer NOT NULL DEFAULT 0;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "purchasedPublicationSlots" integer NOT NULL DEFAULT 0;

UPDATE "user" u
SET "referralSlotsEarned" = sub.capped
FROM (
  SELECT
    r.id AS referrer_id,
    LEAST(3, COUNT(c.id)::int) AS capped
  FROM "user" r
  LEFT JOIN "user" c ON c."referredByUserId" = r.id
  GROUP BY r.id
) sub
WHERE u.id = sub.referrer_id;

CREATE TABLE IF NOT EXISTS "publication_slot_purchase" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "kind" character varying(16) NOT NULL,
  "slotsGranted" integer NOT NULL,
  "amountPen" numeric(10, 2) NOT NULL,
  "status" character varying(24) NOT NULL DEFAULT 'pending_payment',
  "paymentReference" character varying(255),
  "fulfilledByUserId" uuid,
  "fulfilledAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_publication_slot_purchase" PRIMARY KEY ("id"),
  CONSTRAINT "FK_publication_slot_purchase_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_publication_slot_purchase_fulfilledBy" FOREIGN KEY ("fulfilledByUserId") REFERENCES "user"("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "IDX_publication_slot_purchase_userId" ON "publication_slot_purchase" ("userId");
CREATE INDEX IF NOT EXISTS "IDX_publication_slot_purchase_status" ON "publication_slot_purchase" ("status");
