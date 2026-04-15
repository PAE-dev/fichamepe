-- Referidos y cupo de publicaciones.
-- Nombres de columna en camelCase como el resto de "user" (fullName, tokenBalance, etc.) — alineado con TypeORM.
-- Amnistía: referralMigrationCredits = max(0, servicios_actuales - 3) por usuario.

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "referralCode" character varying(16);
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "referredByUserId" uuid;
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "referralMigrationCredits" integer NOT NULL DEFAULT 0;

UPDATE "user" u
SET "referralMigrationCredits" = GREATEST(0, COALESCE(sc.cnt, 0) - 3)
FROM (
  SELECT "userId", COUNT(*)::int AS cnt FROM service GROUP BY "userId"
) sc
WHERE u.id = sc."userId";

UPDATE "user"
SET "referralCode" = UPPER(SUBSTRING(MD5("id"::text || "email"), 1, 10))
WHERE "referralCode" IS NULL OR TRIM("referralCode") = '';

ALTER TABLE "user" ALTER COLUMN "referralCode" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'FK_user_referredByUser'
  ) THEN
    ALTER TABLE "user"
      ADD CONSTRAINT "FK_user_referredByUser"
      FOREIGN KEY ("referredByUserId") REFERENCES "user"("id") ON DELETE SET NULL;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_referralCode" ON "user" ("referralCode");
CREATE INDEX IF NOT EXISTS "IDX_user_referredByUserId" ON "user" ("referredByUserId");
