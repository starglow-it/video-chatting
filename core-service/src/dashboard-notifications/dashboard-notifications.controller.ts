import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

import { USERS_SERVICE } from '@shared/const/services.const';
import {
  CREATE_DASHBOARD_NOTIFICATION,
  GET_DASHBOARD_NOTIFICATIONS,
  READ_DASHBOARD_NOTIFICATIONS,
} from '@shared/patterns/dashboard';
import { withTransaction } from '../helpers/mongo/withTransaction';
import { DashboardNotificationsService } from './dashboard-notifications.service';
import { UsersService } from '../users/users.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { DashboardNotificationDTO } from '../dtos/dashboard-notification.dto';
import { ICreateDashboardNotification } from '@shared/interfaces/create-dashboard-notification.interface';
import { IDashboardNotification } from '@shared/interfaces/dashboard-notification.interface';
import { DashboardNotificationReadStatus } from '@shared/types/dashboard-notification.type';
import { TasksService } from '../tasks/tasks.service';
import { getTimeoutTimestamp } from '../utils/getTimeoutTimestamp';
import { TimeoutTypesEnum } from '../types/timeoutTypes.enum';

@Controller('dashboard-notifications')
export class DashboardNotificationsController {
  constructor(
    private dashboardNotificationService: DashboardNotificationsService,
    private usersService: UsersService,
    private userTemplatesService: UserTemplatesService,
    private taskService: TasksService,
    @InjectConnection() private connection: Connection,
  ) {}

  @MessagePattern({ cmd: CREATE_DASHBOARD_NOTIFICATION })
  async createDashboardNotification(
    @Payload()
    {
      templateId,
      senderId,
      receiverId,
      notificationType,
    }: ICreateDashboardNotification,
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const sender = await this.usersService.findById(senderId, session);
        const receiver = await this.usersService.findById(receiverId, session);

        const template = await this.userTemplatesService.findUserTemplateById({
          id: templateId,
          session,
        });

        const isNotificationExists =
          await this.dashboardNotificationService.exists({
            sender,
            notificationType,
          });

        let notification;

        if (isNotificationExists) {
          notification =
            await this.dashboardNotificationService.findAndUpdateNotification({
              query: {
                sender,
                notificationType,
              },
              data: {
                sentAt: Date.now(),
                status: DashboardNotificationReadStatus.active,
              },
              session,
              populatePath: [
                { path: 'sender', populate: { path: 'profileAvatar' } },
                { path: 'template' },
              ],
            });
        } else {
          [notification] =
            await this.dashboardNotificationService.createNotification(
              {
                sender,
                receiver,
                template,
                notificationType,
                status: DashboardNotificationReadStatus.active,
                sentAt: Date.now(),
              },
              session,
            );

          await notification.populate([
            { path: 'sender', populate: { path: 'profileAvatar' } },
            { path: 'template' },
          ]);

          this.taskService.addTimeout({
            name: `dashboard:deleteNotification:${notification._id}`,
            ts: getTimeoutTimestamp({
              type: TimeoutTypesEnum.Hours,
              value: 24,
            }),
            callback: () => {
              this.dashboardNotificationService.deleteNotification(
                notification._id,
              );
            },
          });
        }

        return plainToClass(DashboardNotificationDTO, notification, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
      }
    });
  }

  @MessagePattern({ cmd: GET_DASHBOARD_NOTIFICATIONS })
  async getDashboardNotification(
    @Payload() { receiverId }: { receiverId: string },
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const receiver = await this.usersService.findById(receiverId, session);

        const notifications =
          await this.dashboardNotificationService.findNotifications({
            query: { receiver },
            session,
            populatePath: [
              { path: 'sender', populate: { path: 'profileAvatar' } },
              { path: 'template' },
            ],
          });

        return plainToClass(DashboardNotificationDTO, notifications, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
      }
    });
  }

  @MessagePattern({ cmd: READ_DASHBOARD_NOTIFICATIONS })
  async readDashboardNotification(
    @Payload()
    {
      receiverId,
      notifications,
    }: {
      receiverId: string;
      notifications: IDashboardNotification['id'][];
    },
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const receiver = await this.usersService.findById(receiverId, session);

        await this.dashboardNotificationService.updateNotifications({
          query: { receiver, _id: { $in: notifications } },
          data: { status: DashboardNotificationReadStatus.inactive },
          session,
        });

        const updatedNotifications =
          await this.dashboardNotificationService.findNotifications({
            query: { receiver },
            session,
            populatePath: [
              { path: 'sender', populate: { path: 'profileAvatar' } },
              { path: 'template' },
            ],
          });

        return plainToClass(DashboardNotificationDTO, updatedNotifications, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      } catch (err) {
        throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
      }
    });
  }
}
