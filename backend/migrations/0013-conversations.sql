-- Hilos de chat por publicación + comprador, y mensajes persistidos.
-- Ejecutar en Postgres:
--   psql "postgresql://USER:PASS@HOST:PORT/DATABASE?sslmode=require" -f migrations/0013-conversations.sql

CREATE TABLE IF NOT EXISTS "conversation" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "serviceId" uuid NOT NULL,
  "sellerUserId" uuid NOT NULL,
  "buyerUserId" uuid NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "FK_conversation_service"
    FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_conversation_seller"
    FOREIGN KEY ("sellerUserId") REFERENCES "user"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_conversation_buyer"
    FOREIGN KEY ("buyerUserId") REFERENCES "user"("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_conversation_service_buyer" UNIQUE ("serviceId", "buyerUserId")
);

CREATE INDEX IF NOT EXISTS "IDX_conversation_seller" ON "conversation" ("sellerUserId");
CREATE INDEX IF NOT EXISTS "IDX_conversation_buyer" ON "conversation" ("buyerUserId");
CREATE INDEX IF NOT EXISTS "IDX_conversation_updated" ON "conversation" ("updatedAt");

CREATE TABLE IF NOT EXISTS "conversation_message" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "conversationId" uuid NOT NULL,
  "senderUserId" uuid NOT NULL,
  "body" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT "FK_conversation_message_conversation"
    FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_conversation_message_sender"
    FOREIGN KEY ("senderUserId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IDX_conversation_message_conversation_created"
  ON "conversation_message" ("conversationId", "createdAt");
