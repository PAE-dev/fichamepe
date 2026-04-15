-- Auditoría básica de login/refresh: IP + user-agent por usuario.
-- Ejecutar en Postgres:
--   psql "postgresql://USER:PASS@HOST:PORT/DATABASE?sslmode=require" -f migrations/0011-auth-login-events.sql

CREATE TABLE IF NOT EXISTS "auth_login_event" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL,
  "ip" character varying(64) NOT NULL,
  "userAgent" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "FK_auth_login_event_user"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IDX_auth_login_event_user" ON "auth_login_event" ("userId");
CREATE INDEX IF NOT EXISTS "IDX_auth_login_event_created_at" ON "auth_login_event" ("createdAt");

