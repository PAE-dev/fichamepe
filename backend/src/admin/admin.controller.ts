import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/infrastructure/guards/roles.guard';
import { Roles } from '../auth/infrastructure/decorators/roles.decorator';
import { CurrentUser } from '../auth/infrastructure/decorators/current-user.decorator';
import type { RequestUser } from '../auth/domain/services/auth-token.service.interface';
import { UserRole } from '../users/domain/entities/user';
import { RequestServiceChangesBodyDto } from './application/dto/request-service-changes.dto';
import { ListReviewQueueUseCase } from './application/use-cases/list-review-queue.use-case';
import { ApproveServicePublicationUseCase } from './application/use-cases/approve-service-publication.use-case';
import { RequestServiceChangesUseCase } from './application/use-cases/request-service-changes.use-case';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AdminController {
  constructor(
    private readonly listReviewQueue: ListReviewQueueUseCase,
    private readonly approveService: ApproveServicePublicationUseCase,
    private readonly requestServiceChanges: RequestServiceChangesUseCase,
  ) {}

  @Get('services/review-queue')
  reviewQueue() {
    return this.listReviewQueue.execute();
  }

  @Patch('services/:id/approve')
  approve(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.approveService.execute(id, user.userId);
  }

  @Patch('services/:id/request-changes')
  requestChanges(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: RequestUser,
    @Body() body: RequestServiceChangesBodyDto,
  ) {
    return this.requestServiceChanges.execute(id, user.userId, body.comment);
  }
}
