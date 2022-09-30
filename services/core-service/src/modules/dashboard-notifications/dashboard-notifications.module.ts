import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DashboardNotificationsService } from './dashboard-notifications.service';
import {
  DashboardNotification,
  DashboardNotificationSchema,
} from '../../schemas/dashboard-notification.schema';
import { DashboardNotificationsController } from './dashboard-notifications.controller';
import { UsersModule } from '../users/users.module';
import { UserTemplatesModule } from '../user-templates/user-templates.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    UsersModule,
    UserTemplatesModule,
    TasksModule,
    MongooseModule.forFeature([
      {
        name: DashboardNotification.name,
        schema: DashboardNotificationSchema,
      },
    ]),
  ],
  providers: [DashboardNotificationsService],
  controllers: [DashboardNotificationsController],
})
export class DashboardNotificationsModule {}
