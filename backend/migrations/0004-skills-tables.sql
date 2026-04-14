-- Tablas para el módulo de skills (evita "no existe la relación «skills»" al arrancar).
CREATE TABLE IF NOT EXISTS "skills" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" character varying NOT NULL,
  "category" character varying NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_skills" PRIMARY KEY ("id"),
  CONSTRAINT "UQ_skills_name" UNIQUE ("name")
);

CREATE TABLE IF NOT EXISTS "profile_skills" (
  "profileId" uuid NOT NULL,
  "skillId" uuid NOT NULL,
  CONSTRAINT "PK_profile_skills" PRIMARY KEY ("profileId", "skillId"),
  CONSTRAINT "FK_profile_skills_profile" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_profile_skills_skill" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE
);
