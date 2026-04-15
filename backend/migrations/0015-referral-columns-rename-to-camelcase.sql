-- Si ya aplicaste 0014 con nombres en snake_case, TypeORM no las encuentra.
-- Esta migración renombra a camelCase como el resto de la tabla "user".

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND c.relname = 'user'
      AND a.attname = 'referral_code'
      AND NOT a.attisdropped
  ) THEN
    ALTER TABLE "user" RENAME COLUMN "referral_code" TO "referralCode";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND c.relname = 'user'
      AND a.attname = 'referred_by_user_id'
      AND NOT a.attisdropped
  ) THEN
    ALTER TABLE "user" RENAME COLUMN "referred_by_user_id" TO "referredByUserId";
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_attribute a
    JOIN pg_class c ON a.attrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
      AND c.relname = 'user'
      AND a.attname = 'referral_migration_credits'
      AND NOT a.attisdropped
  ) THEN
    ALTER TABLE "user" RENAME COLUMN "referral_migration_credits" TO "referralMigrationCredits";
  END IF;
END $$;

-- Índices/constraints creados con el nombre antiguo (opcional, por si quedaron nombres viejos)
DROP INDEX IF EXISTS "UQ_user_referral_code";
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_user_referralCode" ON "user" ("referralCode");
CREATE INDEX IF NOT EXISTS "IDX_user_referredByUserId" ON "user" ("referredByUserId");

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_user_referred_by_user') THEN
    ALTER TABLE "user" RENAME CONSTRAINT "FK_user_referred_by_user" TO "FK_user_referredByUser";
  END IF;
END $$;
