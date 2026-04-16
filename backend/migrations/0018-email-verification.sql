-- Verificación de correo (enlace con token de un solo uso).
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP WITH TIME ZONE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "emailVerificationToken" character varying;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "emailVerificationExpires" TIMESTAMP WITH TIME ZONE;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "emailVerificationLastSentAt" TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS "IDX_user_emailVerificationToken"
  ON "user" ("emailVerificationToken")
  WHERE "emailVerificationToken" IS NOT NULL;

-- Cuentas ya existentes: considerarlas verificadas (no bloquear al desplegar).
UPDATE "user" SET "emailVerifiedAt" = now() WHERE "emailVerifiedAt" IS NULL;
