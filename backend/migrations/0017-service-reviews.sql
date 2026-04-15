-- Reseñas de publicaciones (servicios) + agregados en service
-- psql ... -f migrations/0017-service-reviews.sql

ALTER TABLE "service"
  ADD COLUMN IF NOT EXISTS "reviewCount" integer NOT NULL DEFAULT 0;

ALTER TABLE "service"
  ADD COLUMN IF NOT EXISTS "reviewAverage" numeric(3, 1) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS "service_review" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "serviceId" uuid NOT NULL,
  "authorUserId" uuid NOT NULL,
  "rating" smallint NOT NULL,
  "body" text NOT NULL,
  "isVerifiedPurchase" boolean NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_service_review" PRIMARY KEY ("id"),
  CONSTRAINT "FK_service_review_service" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_service_review_author" FOREIGN KEY ("authorUserId") REFERENCES "user"("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_service_review_rating" CHECK ("rating" >= 1 AND "rating" <= 5),
  CONSTRAINT "UQ_service_review_service_author" UNIQUE ("serviceId", "authorUserId")
);

CREATE INDEX IF NOT EXISTS "IDX_service_review_service_created"
  ON "service_review" ("serviceId", "createdAt" DESC);
