-- Alinea la tabla "service" con ServiceOrmEntity (status, wizard, descripción 600).
-- Ejecutar en Postgres si ves: column "status" of relation "service" does not exist
--   psql "postgresql://USER:PASS@HOST:PORT/DATABASE?sslmode=require" -f migrations/0007-service-status-columns.sql
-- (desde la carpeta backend; no es un problema de AWS/S3)

ALTER TABLE "service" ADD COLUMN IF NOT EXISTS "category" character varying(40) NOT NULL DEFAULT 'other';
ALTER TABLE "service" ADD COLUMN IF NOT EXISTS "deliveryMode" character varying(32) NOT NULL DEFAULT 'digital';
ALTER TABLE "service" ADD COLUMN IF NOT EXISTS "deliveryTime" character varying(40) NOT NULL DEFAULT 'A coordinar';
ALTER TABLE "service" ADD COLUMN IF NOT EXISTS "revisionsIncluded" character varying(16) NOT NULL DEFAULT '0';

ALTER TABLE "service" ADD COLUMN IF NOT EXISTS "status" character varying(16);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'service'
      AND column_name = 'isActive'
  ) THEN
    UPDATE "service"
    SET "status" = CASE WHEN "isActive" IS TRUE THEN 'ACTIVA' ELSE 'PAUSADA' END;
  END IF;
END $$;

UPDATE "service" SET "status" = 'BORRADOR' WHERE "status" IS NULL;

ALTER TABLE "service" ALTER COLUMN "status" SET DEFAULT 'BORRADOR';
ALTER TABLE "service" ALTER COLUMN "status" SET NOT NULL;

ALTER TABLE "service" DROP COLUMN IF EXISTS "isActive";

ALTER TABLE "service" ALTER COLUMN "description" TYPE character varying(600);

DROP INDEX IF EXISTS "IDX_service_is_active";

CREATE INDEX IF NOT EXISTS "IDX_service_status" ON "service" ("status");
