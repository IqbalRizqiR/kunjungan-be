import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VisitsModule } from './visits/visits.module';
import { SessionsModule } from './sessions/sessions.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { EventsModule } from './events/events.module';
import { SettingsModule } from './settings/settings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaService } from 'prisma/prisma.service';
import { VisitSettingsModule } from './visit-settings/visit-settings.module';
import { MailModule } from './mail.module';
import { NotificationGateway } from './NotificationGateway';
import { TujuanModule } from './tujuan/tujuan.module';

@Module({
  imports: [AuthModule, MailModule, TujuanModule, VisitSettingsModule, UsersModule, VisitsModule, SessionsModule, InstitutionsModule, EventsModule, SettingsModule, NotificationsModule, VisitSettingsModule, TujuanModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, NotificationGateway],
  exports: [PrismaService, NotificationGateway], // Export PrismaService for use in other modules
})
export class AppModule {}
