-- Favoritos por usuario (corazón en tarjetas de servicio).
CREATE TABLE IF NOT EXISTS "service_favorite" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "serviceId" uuid NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_service_favorite" PRIMARY KEY ("id"),
  CONSTRAINT "UQ_service_favorite_user_service" UNIQUE ("userId", "serviceId"),
  CONSTRAINT "FK_service_favorite_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_service_favorite_service" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IDX_service_favorite_user_id" ON "service_favorite" ("userId");
CREATE INDEX IF NOT EXISTS "IDX_service_favorite_service_id" ON "service_favorite" ("serviceId");
