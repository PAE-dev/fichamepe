-- Recuperación de contraseña (token de un solo uso).
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "passwordResetToken" character varying;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "passwordResetExpires" TIMESTAMP WITHOUT TIME ZONE;

CREATE INDEX IF NOT EXISTS "IDX_user_passwordResetToken"
  ON "user" ("passwordResetToken")
  WHERE "passwordResetToken" IS NOT NULL;
