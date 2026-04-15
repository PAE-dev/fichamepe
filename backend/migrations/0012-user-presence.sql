-- Presencia/online: último "heartbeat" por usuario.
-- Ejecutar en Postgres:
--   psql "postgresql://USER:PASS@HOST:PORT/DATABASE?sslmode=require" -f migrations/0012-user-presence.sql

CREATE TABLE IF NOT EXISTS "user_presence" (
  "userId" uuid PRIMARY KEY,
  "ip" character varying(64) NOT NULL,
  "userAgent" text NOT NULL,
  "lastSeenAt" timestamptz NOT NULL,
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "FK_user_presence_user"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IDX_user_presence_last_seen" ON "user_presence" ("lastSeenAt");

