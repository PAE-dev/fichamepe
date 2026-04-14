import type { SkillSeedItem } from '../../domain/repositories/i-skill.repository';

export const PREDEFINED_SKILLS_BY_CATEGORY: Record<string, readonly string[]> =
  {
    programacion: [
      'Desarrollo web',
      'React',
      'Node.js',
      'Python',
      'Flutter',
      'NestJS',
      'PostgreSQL',
    ],
    diseno: [
      'Diseño gráfico',
      'UI/UX',
      'Figma',
      'Illustrator',
      'Photoshop',
      'Canva',
    ],
    marketing: [
      'Marketing digital',
      'SEO',
      'Redes sociales',
      'Email marketing',
      'Google Ads',
    ],
    idiomas: ['Inglés', 'Portugués', 'Francés', 'Alemán', 'Chino mandarín'],
    video_foto: [
      'Video editing',
      'Fotografía',
      'Edición de video',
      'Motion graphics',
      'Retoque fotográfico',
    ],
    eventos: [
      'Animación de fiestas',
      'DJ para eventos',
      'Organización de eventos',
      'Catering',
      'Decoración de eventos',
    ],
    redaccion: ['Redacción', 'Copywriting', 'Guiones', 'Blogging'],
    musica: ['Música', 'Guitarra', 'Piano', 'Canto', 'Producción musical'],
    otros: ['Traducción', 'Clases particulares', 'Consultoría', 'Asistente virtual'],
  };

export const SKILL_CATEGORIES = Object.keys(PREDEFINED_SKILLS_BY_CATEGORY);

export function flatPredefinedSkillSeeds(): SkillSeedItem[] {
  return Object.entries(PREDEFINED_SKILLS_BY_CATEGORY).flatMap(
    ([category, names]) => names.map((name) => ({ name, category })),
  );
}
