import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import type { RequestUser } from '../../../auth/domain/services/auth-token.service.interface';
import { CreateServiceReviewBodyDto } from '../../application/dto/create-service-review.dto';
import { ListServiceReviewsQueryDto } from '../../application/dto/list-service-reviews-query.dto';
import { CreateServiceReviewUseCase } from '../../application/use-cases/create-service-review.use-case';
import { GetMyServiceReviewUseCase } from '../../application/use-cases/get-my-service-review.use-case';
import { ListServiceReviewsUseCase } from '../../application/use-cases/list-service-reviews.use-case';

@Controller('services')
export class ServiceReviewsController {
  constructor(
    private readonly listReviews: ListServiceReviewsUseCase,
    private readonly createReview: CreateServiceReviewUseCase,
    private readonly getMyReview: GetMyServiceReviewUseCase,
  ) {}

  @Get(':serviceId/reviews/mine')
  @UseGuards(JwtAuthGuard)
  mine(
    @Param('serviceId', new ParseUUIDPipe()) serviceId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.getMyReview.execute(serviceId, user.userId);
  }

  @Get(':serviceId/reviews')
  list(
    @Param('serviceId', new ParseUUIDPipe()) serviceId: string,
    @Query() query: ListServiceReviewsQueryDto,
  ) {
    return this.listReviews.execute(serviceId, query.limit, query.offset);
  }

  @Post(':serviceId/reviews')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('serviceId', new ParseUUIDPipe()) serviceId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: CreateServiceReviewBodyDto,
  ) {
    return this.createReview.execute(serviceId, user.userId, body);
  }
}
