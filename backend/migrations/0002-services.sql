-- Postgres: ejecutar contra la base configurada en DATABASE_* cuando DATABASE_USE_SQLITE=false.
-- Tablas "user", "profile", "service" (singular), alineadas con las entidades TypeORM.
CREATE TABLE IF NOT EXISTS "service" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "title" character varying(80) NOT NULL,
  "description" character varying(280) NOT NULL,
  "price" numeric(10, 2),
  "currency" character varying(3) NOT NULL DEFAULT 'PEN',
  "coverImageUrl" character varying,
  "isActive" boolean NOT NULL DEFAULT true,
  "viewCount" integer NOT NULL DEFAULT 0,
  "tags" text,
  "profileId" uuid NOT NULL,
  "userId" uuid NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_service" PRIMARY KEY ("id"),
  CONSTRAINT "FK_service_profile" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_service_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IDX_service_is_active" ON "service" ("isActive");
CREATE INDEX IF NOT EXISTS "IDX_service_view_count" ON "service" ("viewCount");
CREATE INDEX IF NOT EXISTS "IDX_service_created_at" ON "service" ("createdAt");
