import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';
import { ServicesModule } from '../services/services.module';
import { ListReviewQueueUseCase } from './application/use-cases/list-review-queue.use-case';
import { ApproveServicePublicationUseCase } from './application/use-cases/approve-service-publication.use-case';
import { RequestServiceChangesUseCase } from './application/use-cases/request-service-changes.use-case';

@Module({
  imports: [AuthModule, ServicesModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    ListReviewQueueUseCase,
    ApproveServicePublicationUseCase,
    RequestServiceChangesUseCase,
  ],
})
export class AdminModule {}
