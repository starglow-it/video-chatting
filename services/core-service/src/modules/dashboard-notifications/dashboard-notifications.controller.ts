import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

import { USERS_SERVICE, DashboardBrokerPatterns } from 'shared-const';
import {
  CreateNotificationPayload,
  ReadNotificationsPayload,
  DashboardNotificationReadStatus,
  TimeoutTypesEnum,
  GetNotificationsPayload,
} from 'shared-types';
import { getTimeoutTimestamp, subtractDays } from 'shared-utils';

import { withTransaction } from '../../helpers/mongo/withTransaction';

// services
import { DashboardNotificationsService } from './dashboard-notifications.service';
import { UsersService } from '../users/users.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { TasksService } from '../tasks/tasks.service';

// dtos
import { DashboardNotificationDTO } from '../../dtos/dashboard-notification.dto';

@Controller('dashboard-notifications')
export class DashboardNotificationsController {
  constructor(
    private dashboardNotificationService: DashboardNotificationsService,
    private usersService: UsersService,
    private userTemplatesService: UserTemplatesService,
    private taskService: TasksService,
    @InjectConnection() private connection: Connection,
  ) {}

  @MessagePattern({ cmd: DashboardBrokerPatterns.CreateNotification })
  async createDashboardNotification(
    @Payload()
    {
      templateId,
      senderId,
      notificationType,
      senderFullName,
    }: CreateNotificationPayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        const template = await this.userTemplatesService.findById({
          id: templateId,
          session,
        });

        const sender = senderId
          ? await this.usersService.findById(senderId, session)
          : '';

        const receiver = await this.usersService.findById(
          template.user._id,
          session,
        );

        const isNotificationExists =
          await this.dashboardNotificationService.exists({
            ...(sender ? { sender } : {}),
            receiver,
            notificationType,
            sentAt: Date.now(),
          });

        let notification;

        if (isNotificationExists) {
          notification =
            await this.dashboardNotificationService.findAndUpdateNotification({
              query: {
                ...(sender ? { sender } : {}),
                notificationType,
              },
              data: {
                sentAt: Date.now(),
                status: DashboardNotificationReadStatus.active,
                template,
              },
              session,
              populatePaths: [
                { path: 'sender', populate: { path: 'profileAvatar' } },
                { path: 'template' },
              ],
            });
        } else {
          notification =
            await this.dashboardNotificationService.createNotification({
              data: {
                ...(sender ? { sender } : {}),
                receiver,
                template: template._id,
                notificationType,
                isSenderGuest: Boolean(sender),
                senderFullName,
                status: DashboardNotificationReadStatus.active,
                sentAt: Date.now(),
              },
              session,
            });

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

        return plainToInstance(DashboardNotificationDTO, notification, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: DashboardBrokerPatterns.GetNotifications })
  async getDashboardNotification(
    @Payload() { receiverId }: GetNotificationsPayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
        const receiver = await this.usersService.findById(receiverId, session);

        const notifications =
          await this.dashboardNotificationService.findNotifications({
            query: { receiver },
            session,
            populatePaths: [
              { path: 'sender', populate: { path: 'profileAvatar' } },
              { path: 'template' },
            ],
          });

        return plainToInstance(DashboardNotificationDTO, notifications, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: DashboardBrokerPatterns.ReadNotifications })
  async readDashboardNotification(
    @Payload() { receiverId, notifications }: ReadNotificationsPayload,
  ) {
    try {
      return withTransaction(this.connection, async (session) => {
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
            populatePaths: [
              { path: 'sender', populate: { path: 'profileAvatar' } },
              { path: 'template' },
            ],
          });

        return plainToInstance(DashboardNotificationDTO, updatedNotifications, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }

  @MessagePattern({ cmd: DashboardBrokerPatterns.DeleteNotifications })
  async deleteDashboardNotifications() {
    try {
      return this.dashboardNotificationService.deleteManyNotifications({
        sentAt: { $lt: subtractDays(Date.now(), 1) },
      });
    } catch (err) {
      throw new RpcException({ message: err.message, ctx: USERS_SERVICE });
    }
  }
}
