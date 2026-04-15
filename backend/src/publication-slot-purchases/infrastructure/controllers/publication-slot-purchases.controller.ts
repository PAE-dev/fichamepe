import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import type { RequestUser } from '../../../auth/domain/services/auth-token.service.interface';
import { UserRole } from '../../../users/domain/entities/user';
import { CreatePublicationSlotPurchaseBodyDto } from '../../application/dto/create-publication-slot-purchase.dto';
import { CreatePendingPublicationSlotPurchaseUseCase } from '../../application/use-cases/create-pending-publication-slot-purchase.use-case';
import { FulfillPublicationSlotPurchaseUseCase } from '../../application/use-cases/fulfill-publication-slot-purchase.use-case';
import { ListMyPublicationSlotPurchasesUseCase } from '../../application/use-cases/list-my-publication-slot-purchases.use-case';

@Controller('publication-slot-purchases')
export class PublicationSlotPurchasesController {
  constructor(
    private readonly createPending: CreatePendingPublicationSlotPurchaseUseCase,
    private readonly fulfillPurchase: FulfillPublicationSlotPurchaseUseCase,
    private readonly listMine: ListMyPublicationSlotPurchasesUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: RequestUser,
    @Body() body: CreatePublicationSlotPurchaseBodyDto,
  ) {
    return this.createPending.execute({
      userId: user.userId,
      kind: body.kind,
      paymentReference: body.paymentReference,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  listMe(@CurrentUser() user: RequestUser) {
    return this.listMine.execute(user.userId);
  }

  @Patch(':id/fulfill')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  fulfill(
    @CurrentUser() admin: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.fulfillPurchase.execute({
      purchaseId: id,
      adminUserId: admin.userId,
    });
  }
}
