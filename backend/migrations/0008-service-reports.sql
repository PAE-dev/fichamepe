-- Tabla para reportes de publicaciones desde la ficha pública
-- Ejecutar en Postgres:
--   psql "postgresql://USER:PASS@HOST:PORT/DATABASE?sslmode=require" -f migrations/0008-service-reports.sql

CREATE TABLE IF NOT EXISTS "service_report" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "serviceId" uuid NOT NULL,
  "reporterUserId" uuid NOT NULL,
  "reason" character varying(40) NOT NULL,
  "details" character varying(1000),
  "createdAt" timestamp NOT NULL DEFAULT now(),
  CONSTRAINT "FK_service_report_service"
    FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_service_report_reporter"
    FOREIGN KEY ("reporterUserId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IDX_service_report_service" ON "service_report" ("serviceId");
CREATE INDEX IF NOT EXISTS "IDX_service_report_reporter" ON "service_report" ("reporterUserId");
CREATE INDEX IF NOT EXISTS "IDX_service_report_created_at" ON "service_report" ("createdAt");
