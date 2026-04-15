import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/infrastructure/decorators/roles.decorator';
import { UserRole } from '../../../users/domain/entities/user';
import { AdminStatsQueryDto } from '../dto/admin-stats-query.dto';
import { AdminStatsService } from '../services/admin-stats.service';

@Controller('admin/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AdminStatsController {
  constructor(private readonly stats: AdminStatsService) {}

  @Get('overview')
  overview(@Query() query: AdminStatsQueryDto) {
    const bucket = query.bucket ?? 'day';

    const now = new Date();
    const to = query.to ? new Date(query.to) : now;
    const from = query.from ? new Date(query.from) : new Date(to.getTime() - 30 * 24 * 60 * 60_000);

    return this.stats.getOverview({
      bucket,
      from,
      to,
      onlineWindowMinutes: 5,
    });
  }
}

