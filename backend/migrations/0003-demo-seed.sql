-- Datos de demo: tablas "user", "profile", "service" (singular), como en TypeORM.
--
-- Si ves 25P02: ejecuta ROLLBACK; en la misma sesión y vuelve a lanzar el archivo completo.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'service'
  ) THEN
    EXECUTE 'DELETE FROM "service"';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profile_skills'
  ) THEN
    EXECUTE 'DELETE FROM "profile_skills"';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profile'
  ) THEN
    EXECUTE 'DELETE FROM "profile"';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user'
  ) THEN
    EXECUTE 'DELETE FROM "user"';
  END IF;
END $$;

INSERT INTO "user" (id, email, password, role, "isActive", "isPro", "tokenBalance") VALUES
('a1b2c3d4-0001-0001-0001-000000000001', 'juan.comediante@gmail.com', '$2b$10$placeholder', 'freelancer', true, true, 10),
('a1b2c3d4-0002-0002-0002-000000000002', 'maria.diseno@gmail.com', '$2b$10$placeholder', 'freelancer', true, false, 5),
('a1b2c3d4-0003-0003-0003-000000000003', 'carlos.profe@gmail.com', '$2b$10$placeholder', 'freelancer', true, true, 8),
('a1b2c3d4-0004-0004-0004-000000000004', 'lucia.community@gmail.com', '$2b$10$placeholder', 'freelancer', true, false, 3),
('a1b2c3d4-0005-0005-0005-000000000005', 'pedro.streamer@gmail.com', '$2b$10$placeholder', 'freelancer', true, true, 12),
('a1b2c3d4-0006-0006-0006-000000000006', 'ana.hater@gmail.com', '$2b$10$placeholder', 'freelancer', true, false, 6),
('a1b2c3d4-0007-0007-0007-000000000007', 'diego.video@gmail.com', '$2b$10$placeholder', 'freelancer', true, true, 9),
('a1b2c3d4-0008-0008-0008-000000000008', 'sofia.abogada@gmail.com', '$2b$10$placeholder', 'freelancer', true, false, 4),
('a1b2c3d4-0009-0009-0009-000000000009', 'miguel.musico@gmail.com', '$2b$10$placeholder', 'freelancer', true, true, 7),
('a1b2c3d4-0010-0010-0010-000000000010', 'valeria.coach@gmail.com', '$2b$10$placeholder', 'freelancer', true, false, 2),
('a1b2c3d4-0011-0011-0011-000000000011', 'renzo.animador@gmail.com', '$2b$10$placeholder', 'freelancer', true, true, 15),
('a1b2c3d4-0012-0012-0012-000000000012', 'camila.excel@gmail.com', '$2b$10$placeholder', 'freelancer', true, false, 5);

INSERT INTO "profile" (id, "displayName", bio, district, "whatsappNumber", "hourlyRate", "isAvailable", "userId") VALUES
('b1b2c3d4-0001-0001-0001-000000000001', 'Juan el Comediante', 'Hago reír a equipos aburridos por Meet. 5 años haciendo stand-up en Lima.', 'Miraflores', '51999000001', 80, true, 'a1b2c3d4-0001-0001-0001-000000000001'),
('b1b2c3d4-0002-0002-0002-000000000002', 'María Diseños', 'Diseñadora gráfica obsesionada con el detalle. Posts de IG que la gente guarda.', 'San Isidro', '51999000002', 60, true, 'a1b2c3d4-0002-0002-0002-000000000002'),
('b1b2c3d4-0003-0003-0003-000000000003', 'Carlos Profesor', 'Enseño lo que sea con ejemplos reales. Matemáticas, Excel, programación.', 'Surco', '51999000003', 50, true, 'a1b2c3d4-0003-0003-0003-000000000003'),
('b1b2c3d4-0004-0004-0004-000000000004', 'Lucía Community', 'Doy vida a páginas de Facebook muertas. Engagement real, no bots.', 'Barranco', '51999000004', 45, true, 'a1b2c3d4-0004-0004-0004-000000000004'),
('b1b2c3d4-0005-0005-0005-000000000005', 'Pedro Stream', 'Streamer con 50k seguidores. Te enseño a monetizar desde cero en Twitch.', 'La Molina', '51999000005', 120, true, 'a1b2c3d4-0005-0005-0005-000000000005'),
('b1b2c3d4-0006-0006-0006-000000000006', 'Ana la Hater', 'Soy tu hater profesional. Te digo todo lo malo de tu producto antes que tus clientes.', 'Jesus Maria', '51999000006', 90, true, 'a1b2c3d4-0006-0006-0006-000000000006'),
('b1b2c3d4-0007-0007-0007-000000000007', 'Diego Audiovisual', 'Edito videos que la gente ve hasta el final. TikTok, Reels, YouTube.', 'Lince', '51999000007', 70, true, 'a1b2c3d4-0007-0007-0007-000000000007'),
('b1b2c3d4-0008-0008-0008-000000000008', 'Sofia Abogada', 'Abogada freelance. Reviso tu contrato antes de que lo firmes y te arrepientas.', 'San Borja', '51999000008', 100, true, 'a1b2c3d4-0008-0008-0008-000000000008'),
('b1b2c3d4-0009-0009-0009-000000000009', 'Miguel Musico', 'Productor musical y guitarrista. Clases, composicion y grabacion desde mi estudio.', 'Pueblo Libre', '51999000009', 65, true, 'a1b2c3d4-0009-0009-0009-000000000009'),
('b1b2c3d4-0010-0010-0010-000000000010', 'Valeria Coach', 'Coach de emprendimiento. Te ayudo a dejar de procrastinar y lanzar tu negocio.', 'Miraflores', '51999000010', 85, true, 'a1b2c3d4-0010-0010-0010-000000000010'),
('b1b2c3d4-0011-0011-0011-000000000011', 'Renzo el Animador', 'Animador de fiestas, eventos corporativos y cumpleanos virtuales. El ambiente lo pongo yo.', 'San Miguel', '51999000011', 150, true, 'a1b2c3d4-0011-0011-0011-000000000011'),
('b1b2c3d4-0012-0012-0012-000000000012', 'Camila Excel Queen', 'Domino Excel como nadie. Te enseno a automatizar tu trabajo en 2 horas.', 'Surquillo', '51999000012', 55, true, 'a1b2c3d4-0012-0012-0012-000000000012');

INSERT INTO "service" (id, title, description, price, currency, "isActive", "viewCount", tags, "profileId", "userId") VALUES
('c1000001-0001-0001-0001-000000000001', 'Hago reir a tu equipo por videollamada en 20 minutos', 'Soy comediante y animo reuniones de trabajo aburridas. Tu equipo se va a acordar de esa call para siempre.', 80, 'PEN', true, 245, 'humor,teams,entretenimiento', 'b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001'),
('c1000001-0002-0002-0002-000000000002', 'Diseno 10 posts para tu Instagram en 48 horas', 'Feed bonito, coherente y tuyo. Sin templates genericos de Canva que ya todo el mundo tiene.', 150, 'PEN', true, 312, 'diseno,instagram,redes sociales', 'b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0002-0002-0002-000000000002'),
('c1000001-0003-0003-0003-000000000003', 'Te enseno Excel con los datos de tu propio negocio', 'Nada de tutoriales genericos. Traes tus datos, yo te enseno a dominarlos en 2 horas.', 60, 'PEN', true, 189, 'excel,clases,negocio', 'b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0003-0003-0003-000000000003'),
('c1000001-0004-0004-0004-000000000004', 'Comento y doy vida a tu pagina de Facebook por 7 dias', 'Respondo comentarios, creo conversacion real y subo el engagement de tu pagina como si fuera mia.', 120, 'PEN', true, 98, 'facebook,comunidad,redes sociales', 'b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0004-0004-0004-000000000004'),
('c1000001-0005-0005-0005-000000000005', 'Te enseno a monetizar tu canal de Twitch desde cero', 'Tengo 50k seguidores y se exactamente que funciona y que no. En 3 sesiones tienes tu estrategia completa.', 120, 'PEN', true, 421, 'streaming,twitch,monetizacion', 'b1b2c3d4-0005-0005-0005-000000000005', 'a1b2c3d4-0005-0005-0005-000000000005'),
('c1000001-0006-0006-0006-000000000006', 'Soy tu hater profesional: te digo todo lo malo de tu negocio', 'Antes de que tus clientes te destruyan en redes, yo te digo exactamente que esta mal en tu producto.', 90, 'PEN', true, 534, 'feedback,negocio,consultoria', 'b1b2c3d4-0006-0006-0006-000000000006', 'a1b2c3d4-0006-0006-0006-000000000006'),
('c1000001-0007-0007-0007-000000000007', 'Edito tu TikTok o Reels para que la gente lo vea hasta el final', 'Corto, agrego texto, musica y efectos. Entrega en 24h con 3 versiones distintas.', 70, 'PEN', true, 287, 'video,tiktok,edicion', 'b1b2c3d4-0007-0007-0007-000000000007', 'a1b2c3d4-0007-0007-0007-000000000007'),
('c1000001-0008-0008-0008-000000000008', 'Reviso tu contrato antes de que lo firmes y te arrepientas', 'Soy abogada freelance. Te explico en palabras normales que dice ese contrato. Respuesta en menos de 24h.', 100, 'PEN', true, 156, 'legal,contratos,asesoria', 'b1b2c3d4-0008-0008-0008-000000000008', 'a1b2c3d4-0008-0008-0008-000000000008'),
('c1000001-0009-0009-0009-000000000009', 'Clases de guitarra para adultos que nunca aprendieron', 'Sin juicio, sin escalas interminables. En 4 clases tocas tu primera cancion completa.', 65, 'PEN', true, 203, 'musica,guitarra,clases', 'b1b2c3d4-0009-0009-0009-000000000009', 'a1b2c3d4-0009-0009-0009-000000000009'),
('c1000001-0010-0010-0010-000000000010', 'Te ayudo a lanzar tu negocio en 30 dias o te devuelvo el dinero', 'Coach de emprendimiento con 8 anos de experiencia. Plan de accion personalizado y seguimiento semanal.', 85, 'PEN', true, 378, 'emprendimiento,coaching,negocios', 'b1b2c3d4-0010-0010-0010-000000000010', 'a1b2c3d4-0010-0010-0010-000000000010'),
('c1000001-0011-0011-0011-000000000011', 'Animo tu evento de empresa disfrazado de tu CEO', 'Me aprendo sus frases, sus gestos y sus chistes malos. Garantizo fotos para el grupo de WhatsApp.', 200, 'PEN', true, 612, 'eventos,humor,empresa', 'b1b2c3d4-0011-0011-0011-000000000011', 'a1b2c3d4-0011-0011-0011-000000000011'),
('c1000001-0012-0012-0012-000000000012', 'Automatizo tus reportes de Excel para que no los hagas nunca mas', 'Macros, Power Query y dashboards automaticos. Lo que te toma 2 horas cada semana, en 5 minutos con un boton.', 55, 'PEN', true, 445, 'excel,automatizacion,productividad', 'b1b2c3d4-0012-0012-0012-000000000012', 'a1b2c3d4-0012-0012-0012-000000000012'),
('c1000001-0013-0013-0013-000000000013', 'Escribo el guion de tu proximo video de TikTok', 'Hook, desarrollo y CTA incluidos. Tu solo grabas. Entrego en 24h con 3 variantes.', 45, 'PEN', true, 267, 'tiktok,contenido,guion', 'b1b2c3d4-0007-0007-0007-000000000007', 'a1b2c3d4-0007-0007-0007-000000000007'),
('c1000001-0014-0014-0014-000000000014', 'Soy tu hype man en tu proxima presentacion de negocios', 'Te acompano a tu pitch y genero el ambiente para que llegues en modo ganador.', 110, 'PEN', true, 334, 'eventos,negocios,presentaciones', 'b1b2c3d4-0011-0011-0011-000000000011', 'a1b2c3d4-0011-0011-0011-000000000011'),
('c1000001-0015-0015-0015-000000000015', 'Grabo un video felicitando a quien tu quieras', 'Personalizado, gracioso o emotivo segun lo pidas. Ideal para cumpleanos o sorprender a alguien.', 40, 'PEN', true, 189, 'video,personalizado,regalo', 'b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001'),
('c1000001-0016-0016-0016-000000000016', 'Creo tu logo en 48 horas por S/80', 'Logo profesional, vectorial y con todas las variantes. Sin revisiones infinitas. Entrega en Figma y PNG.', 80, 'PEN', true, 523, 'diseno,logo,branding', 'b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0002-0002-0002-000000000002'),
('c1000001-0017-0017-0017-000000000017', 'Edito tu podcast y lo dejo con sonido profesional', 'Elimino silencios, muletillas y ruido. Agrego musica de fondo e intro. Entrego en 48h.', 85, 'PEN', true, 145, 'podcast,audio,edicion', 'b1b2c3d4-0009-0009-0009-000000000009', 'a1b2c3d4-0009-0009-0009-000000000009'),
('c1000001-0018-0018-0018-000000000018', 'Traduzco tu CV al ingles con terminos de tu sector', 'No es Google Translate. Entiendo tu industria y hago que tu CV suene natural para empresas extranjeras.', 55, 'PEN', true, 234, 'ingles,traduccion,cv', 'b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0003-0003-0003-000000000003');

COMMIT;
