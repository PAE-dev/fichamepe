-- Flujo de moderación para publicaciones (servicios).
-- Agrega estados intermedios, comentario de revisión y trazabilidad básica.

ALTER TABLE "service"
  ALTER COLUMN "status" TYPE character varying(24);

ALTER TABLE "service"
  ADD COLUMN IF NOT EXISTS "moderationComment" text,
  ADD COLUMN IF NOT EXISTS "submittedAt" timestamptz,
  ADD COLUMN IF NOT EXISTS "reviewedAt" timestamptz,
  ADD COLUMN IF NOT EXISTS "reviewedByUserId" uuid;

ALTER TABLE "service"
  ADD CONSTRAINT "FK_service_reviewed_by_user"
  FOREIGN KEY ("reviewedByUserId")
  REFERENCES "user"("id")
  ON DELETE SET NULL;

ALTER TABLE "service"
  DROP CONSTRAINT IF EXISTS "CHK_service_status_allowed";

ALTER TABLE "service"
  ADD CONSTRAINT "CHK_service_status_allowed"
  CHECK ("status" IN ('ACTIVA', 'BORRADOR', 'PAUSADA', 'EN_REVISION', 'REQUIERE_CAMBIOS'));
