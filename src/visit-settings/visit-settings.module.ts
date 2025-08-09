import { Module } from '@nestjs/common';
import { VisitSettingsService } from './visit-settings.service';
import { VisitSettingsController } from './visit-settings.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [VisitSettingsService, PrismaService],
  controllers: [VisitSettingsController]
})
export class VisitSettingsModule {}
