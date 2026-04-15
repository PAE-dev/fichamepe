import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresenceController } from './infrastructure/controllers/presence.controller';
import { UserPresenceOrmEntity } from './infrastructure/persistence/entities/user-presence.orm';
import { PresenceService } from './presence.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPresenceOrmEntity])],
  controllers: [PresenceController],
  providers: [PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}

