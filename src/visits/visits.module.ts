import { Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { PrismaService } from 'prisma/prisma.service';
import { MailService } from 'src/mail.service';
import { NotificationGateway } from 'src/NotificationGateway';

@Module({
  providers: [VisitsService, PrismaService, MailService, NotificationGateway],
  controllers: [VisitsController]
})
export class VisitsModule {}
