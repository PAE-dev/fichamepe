import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { CreateServiceUseCase } from './application/use-cases/create-service.use-case';
import { DeleteServiceUseCase } from './application/use-cases/delete-service.use-case';
import { GetFeedServicesUseCase } from './application/use-cases/get-feed-services.use-case';
import { GetServiceByIdUseCase } from './application/use-cases/get-service-by-id.use-case';
import { GetServicesByProfileUseCase } from './application/use-cases/get-services-by-profile.use-case';
import { IncrementViewUseCase } from './application/use-cases/increment-view.use-case';
import { ToggleServiceActiveUseCase } from './application/use-cases/toggle-service-active.use-case';
import { UpdateServiceUseCase } from './application/use-cases/update-service.use-case';
import { ServicesController } from './infrastructure/controllers/services.controller';
import { ServiceFavoriteOrmEntity } from './infrastructure/persistence/entities/service-favorite.orm';
import { ServiceOrmEntity } from './infrastructure/persistence/entities/service.orm';
import { ServiceTypeOrmRepository } from './infrastructure/persistence/repositories/service.typeorm.repository';
import { SERVICE_REPOSITORY } from './services.di-tokens';
import { AddServiceFavoriteUseCase } from './application/use-cases/add-service-favorite.use-case';
import { ListUserFavoriteIdsUseCase } from './application/use-cases/list-user-favorite-ids.use-case';
import { ListUserFavoritesUseCase } from './application/use-cases/list-user-favorites.use-case';
import { RemoveServiceFavoriteUseCase } from './application/use-cases/remove-service-favorite.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceOrmEntity, ServiceFavoriteOrmEntity]),
    ProfilesModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [ServicesController],
  providers: [
    { provide: SERVICE_REPOSITORY, useClass: ServiceTypeOrmRepository },
    IncrementViewUseCase,
    GetFeedServicesUseCase,
    GetServicesByProfileUseCase,
    GetServiceByIdUseCase,
    CreateServiceUseCase,
    UpdateServiceUseCase,
    ToggleServiceActiveUseCase,
    DeleteServiceUseCase,
    ListUserFavoriteIdsUseCase,
    ListUserFavoritesUseCase,
    AddServiceFavoriteUseCase,
    RemoveServiceFavoriteUseCase,
  ],
  exports: [
    SERVICE_REPOSITORY,
    TypeOrmModule.forFeature([ServiceOrmEntity]),
    GetFeedServicesUseCase,
    GetServicesByProfileUseCase,
    GetServiceByIdUseCase,
    CreateServiceUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
    IncrementViewUseCase,
  ],
})
export class ServicesModule {}
