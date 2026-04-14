import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

function isTruthy(value: string | undefined): boolean {
  return value === '1' || value?.toLowerCase() === 'true' || value === 'yes';
}

const syncSchemaInDev = true;

/**
 * SQLite (`DATABASE_USE_SQLITE=true`): sql.js + synchronize en dev.
 * Postgres: sin synchronize; migraciones/SQL para el esquema.
 *
 * Variables: DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD,
 * DATABASE_NAME. TLS si DATABASE_SSL es truthy o el host contiene supabase.co.
 */
export function buildTypeOrmOptions(
  configService: ConfigService,
): TypeOrmModuleOptions {
  if (isTruthy(configService.get<string>('DATABASE_USE_SQLITE'))) {
    return {
      type: 'sqljs',
      driver: require('sql.js'),
      autoLoadEntities: true,
      synchronize: syncSchemaInDev,
      logging: false,
      autoSave: false,
    };
  }

  const host = (configService.get<string>('DATABASE_HOST', 'localhost') ?? '').trim();
  const useSsl =
    isTruthy(configService.get<string>('DATABASE_SSL')) ||
    host.includes('supabase.co');

  return {
    type: 'postgres',
    host,
    port: Number(configService.get<string>('DATABASE_PORT', '5432')),
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    autoLoadEntities: true,
    synchronize: false,
    retryAttempts: 5,
    retryDelay: 3000,
    ...(useSsl ? { ssl: { rejectUnauthorized: false as const } } : {}),
  };
}
