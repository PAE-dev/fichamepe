import { IsUUID } from 'class-validator';

export class AddFavoriteBodyDto {
  /**
   * `validator` v13: `'all'` sigue exigiendo versión 1–8 en el 3er bloque (`[1-8]…`);
   * los UUID demo (`0003`…) fallan. `'loose'` acepta cualquier 8-4-4-4-12 hex (como Postgres).
   */
  @IsUUID('loose')
  serviceId!: string;
}
