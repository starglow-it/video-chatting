import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Global, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import {
  GET_DASHBOARD_NOTIFICATIONS_EVENT,
  JOIN_DASHBOARD,
  JOIN_ROOM_BEFORE_MEETING,
  READ_DASHBOARD_NOTIFICATIONS_EVENT,
  SEND_ENTER_WAITING_ROOM_EVENT,
  SEND_MEETING_AVAILABLE,
} from '../const/socket-events/dashboard.const';

import { BaseGateway } from '../gateway/base.gateway';
import { DashboardService } from './dashboard.service';
import { DashboardNotificationTypes } from '@shared/types/dashboard-notification.type';
import { ResponseSumType } from '@shared/response/common.response';
import { IDashboardNotification } from '@shared/interfaces/dashboard-notification.interface';
import { CoreService } from '../core/core.service';

@Global()
@WebSocketGateway({ transports: ['websocket', 'polling'] })
export class DashboardGateway extends BaseGateway {
  private readonly logger = new Logger(DashboardGateway.name);

  constructor(
    private coreService: CoreService,
    private dashboardService: DashboardService,
  ) {
    super();
  }

  @SubscribeMessage(JOIN_DASHBOARD)
  async joinDashboard(
    @MessageBody() message: { userId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`User joined dashboard room`);

    const user = await this.coreService.findUserById({
      userId: message.userId,
    });

    socket.join(`dashboard:${user.id}`);
  }

  @SubscribeMessage(JOIN_ROOM_BEFORE_MEETING)
  async joinWaitingRoom(
    @MessageBody() message: { templateId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`User joined waiting room ${message.templateId}`);

    socket.join(`waitingRoom:${message.templateId}`);
  }

  @SubscribeMessage(SEND_MEETING_AVAILABLE)
  async sendMeetingAvailable(@MessageBody() message: { templateId: string }) {
    this.logger.log(`Emit meeting available ${message.templateId}`);

    this.emitToRoom(
      `waitingRoom:${message.templateId}`,
      SEND_MEETING_AVAILABLE,
      message,
    );
  }

  @SubscribeMessage(SEND_ENTER_WAITING_ROOM_EVENT)
  async sendEnterWaitingRoom(
    @MessageBody()
    message: {
      templateId: string;
      profileId: string;
      meetingUserId: string;
      username: string;
    },
  ) {
    const notification = await this.dashboardService.createNotification({
      templateId: message.templateId,
      senderId: message.profileId || message.meetingUserId,
      senderFullName: message.username,
      notificationType: DashboardNotificationTypes.enterWaitingRoom,
    });

    this.emitToRoom(
      `dashboard:${notification.receiver.id}`,
      'dashboard:sendNotification',
      {
        notification,
      },
    );
  }

  @SubscribeMessage(GET_DASHBOARD_NOTIFICATIONS_EVENT)
  async getDashboardNotifications(
    @MessageBody() message: { profileId: string },
  ): Promise<ResponseSumType<{ notifications: IDashboardNotification[] }>> {
    const notifications = await this.dashboardService.getNotifications({
      receiverId: message.profileId,
    });

    return {
      success: true,
      result: notifications,
    };
  }

  @SubscribeMessage(READ_DASHBOARD_NOTIFICATIONS_EVENT)
  async readDashboardNotifications(
    @MessageBody()
    message: {
      profileId: string;
      notifications: IDashboardNotification['id'][];
    },
  ): Promise<ResponseSumType<{ notifications: IDashboardNotification[] }>> {
    const notifications = await this.dashboardService.readNotifications({
      receiverId: message.profileId,
      notifications: message.notifications,
    });

    return {
      success: true,
      result: notifications,
    };
  }
}
