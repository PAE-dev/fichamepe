import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import type { RequestUser } from '../../../auth/domain/services/auth-token.service.interface';
import { getRequestIp, getRequestUserAgent } from '../../../common/utils/request-metadata';
import { PresenceService } from '../../presence.service';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presence: PresenceService) {}

  @Post('heartbeat')
  @UseGuards(JwtAuthGuard)
  async heartbeat(@Req() req: Request, @CurrentUser() user: RequestUser) {
    await this.presence.heartbeat({
      userId: user.userId,
      ip: getRequestIp(req),
      userAgent: getRequestUserAgent(req),
      at: new Date(),
    });
    return { ok: true as const };
  }
}

