export type ServiceSeedDefinition = {
  title: string;
  description: string;
  price: number;
  tags: string[];
};

/** Datos creativos para poblar el feed en desarrollo (máx. 280 chars en descripción). */
export const SERVICE_SEED_DATA: ServiceSeedDefinition[] = [
  {
    title: 'Hago reír a tu equipo por videollamada en 20 minutos',
    description:
      'Soy comediante y animo reuniones de trabajo aburridas. Tu equipo se va a acordar de esa call para siempre.',
    price: 80,
    tags: ['entretenimiento', 'teams', 'humor'],
  },
  {
    title: 'Comento y doy vida a tu página de Facebook por 7 días',
    description:
      'Respondo comentarios, creo conversación real y subo el engagement de tu página como si fuera mía.',
    price: 120,
    tags: ['redes sociales', 'facebook', 'comunidad'],
  },
  {
    title: 'Te enseño Excel con ejemplos de tu negocio real',
    description:
      'Nada de tutoriales genéricos. Traes tus datos, yo te enseño a dominarlos en 2 horas.',
    price: 60,
    tags: ['excel', 'clases', 'negocio'],
  },
  {
    title: 'Diseño 10 posts para tu Instagram en 48 horas',
    description:
      'Feed bonito, coherente y tuyo. Sin templates genéricos de Canva que ya todo el mundo tiene.',
    price: 150,
    tags: ['diseño', 'instagram', 'redes sociales'],
  },
  {
    title: 'Grabo un video felicitando a quien tú quieras',
    description:
      'Personalizado, gracioso o emotivo según lo pidas. Ideal para cumpleaños, logros o simplemente sorprender.',
    price: 40,
    tags: ['video', 'personalizado', 'regalo'],
  },
  {
    title: 'Traduzco tu CV al inglés con términos del sector',
    description:
      'No es Google Translate. Entiendo tu industria y hago que tu CV suene natural para empresas extranjeras.',
    price: 55,
    tags: ['inglés', 'traducción', 'cv'],
  },
  {
    title: 'Animo la fiesta de tu empresa disfrazado de tu CEO',
    description:
      'Me aprendo sus frases, sus gestos y sus chistes malos. Garantizo fotos para el grupo de WhatsApp.',
    price: 200,
    tags: ['eventos', 'humor', 'empresa'],
  },
  {
    title: 'Clases de guitarra para adultos que nunca aprendieron',
    description:
      'Sin juicio, sin escalas interminables. En 4 clases tocas tu primera canción completa.',
    price: 70,
    tags: ['música', 'guitarra', 'clases'],
  },
  {
    title: 'Hago el guión de tu próximo video de TikTok o Reels',
    description:
      'Escribo el hook, el desarrollo y el CTA. Tú solo grabas y editas. Entrega en 24h.',
    price: 45,
    tags: ['tiktok', 'contenido', 'guión'],
  },
  {
    title: 'Reviso y mejoro tu contrato o documento legal',
    description:
      'Soy abogado freelance. Te explico qué dice realmente ese contrato antes de que lo firmes.',
    price: 90,
    tags: ['legal', 'contratos', 'asesoría'],
  },
  {
    title: 'Soy tu hype man en tu próxima presentación de negocios',
    description:
      'Te acompaño a tu pitch, te presento con energía y genero el ambiente para que llegues en modo ganador.',
    price: 110,
    tags: ['eventos', 'negocios', 'presentaciones'],
  },
  {
    title: 'Edito tu podcast: quito silencios, muletillas y ruido',
    description:
      'Suenas profesional desde el primer episodio. Entrego en 48h con música de fondo incluida.',
    price: 85,
    tags: ['podcast', 'audio', 'edición'],
  },
];
