import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../../../../app.module';
import { ProfileOrmEntity } from '../../../../profiles/infrastructure/persistence/entities/profile.orm-entity';
import { ServiceOrmEntity } from '../entities/service.orm';
import { SERVICE_SEED_DATA } from './services.seed';

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    const ds = app.get(DataSource);
    const serviceRepo = ds.getRepository(ServiceOrmEntity);
    const profileRepo = ds.getRepository(ProfileOrmEntity);

    const marker = await serviceRepo.findOne({
      where: { title: SERVICE_SEED_DATA[0].title },
    });
    if (marker) {
      console.log(
        'Seed de servicios ya estaba aplicado. No se insertaron filas.',
      );
      return;
    }

    const profiles = await profileRepo.find({
      relations: ['user'],
      order: { id: 'ASC' },
      take: 24,
    });
    if (!profiles.length) {
      console.error(
        'No hay perfiles en la base. Registra usuarios y crea perfiles antes de correr el seed.',
      );
      process.exitCode = 1;
      return;
    }

    for (let i = 0; i < SERVICE_SEED_DATA.length; i++) {
      const def = SERVICE_SEED_DATA[i];
      const profile = profiles[i % profiles.length];
      const row = serviceRepo.create({
        title: def.title,
        description: def.description,
        price: def.price,
        currency: 'PEN',
        coverImageUrl: null,
        isActive: true,
        viewCount: Math.floor(Math.random() * 40),
        tags: def.tags,
        profile,
        owner: profile.user,
      });
      await serviceRepo.save(row);
    }

    console.log(
      `Listo: ${SERVICE_SEED_DATA.length} servicios de ejemplo insertados.`,
    );
  } finally {
    await app.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
