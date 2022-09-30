import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Controller, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { DashboardSubscribeEvents } from '../../const/socket-events/subscribers/dashboard';
import { DashboardEmitEvents } from '../../const/socket-events/emitters/dashboard';

import { BaseGateway } from '../../gateway/base.gateway';

import { DashboardService } from './dashboard.service';
import { CoreService } from '../../services/core/core.service';

import { DashboardNotificationTypes } from '@shared/types/dashboard-notification.type';

import { ResponseSumType } from '@shared/response/common.response';

import { IDashboardNotification } from '@shared/interfaces/dashboard-notification.interface';
import { ScalingService } from '../../services/scaling/scaling.service';

@WebSocketGateway({ transports: ['websocket'] })
@Controller('/dashboard')
export class DashboardGateway extends BaseGateway {
  private readonly logger = new Logger(DashboardGateway.name);

  constructor(
    private coreService: CoreService,
    private dashboardService: DashboardService,
    private scalingService: ScalingService,
  ) {
    super();
  }

  @SubscribeMessage(DashboardSubscribeEvents.OnJoinDashboard)
  async joinDashboard(
    @MessageBody() message: { userId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    if (!message?.userId) {
      this.logger.error({
        message: 'no user id',
        ctx: message,
      });

      return;
    }

    this.logger.debug(`User joined dashboard room`);

    const user = await this.coreService.findUserById({
      userId: message.userId,
    });

    if (user) {
      socket.join(`dashboard:${user.id}`);
    }
  }

  @SubscribeMessage(DashboardSubscribeEvents.OnJoinRoomBeforeMeeting)
  async joinWaitingRoom(
    @MessageBody() message: { templateId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const targetTemplate = await this.coreService.findMeetingTemplate({
      id: message.templateId,
    });

    if (targetTemplate) {
      const user = await this.coreService.findUserById({
        userId: targetTemplate.user.id,
      });

      if (!user.maxMeetingTime && user.subscriptionPlanKey !== 'Business') {
        return {
          success: false,
          message: 'meeting.timeLimit',
        };
      }

      this.logger.debug(`User joined waiting room ${message.templateId}`);

      socket.join(`waitingRoom:${message.templateId}`);
    }
  }

  @SubscribeMessage(DashboardSubscribeEvents.OnCreateMeeting)
  async waitForServer(
    @MessageBody() message: { templateId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`Wait for available server ${message.templateId}`);

    const template = await this.coreService.findMeetingTemplateById({
      id: message.templateId,
    });

    this.scalingService
      .waitForAvailableServer({
        templateId: template.id,
        userId: template.user.id,
        instanceId: template.meetingInstance.instanceId,
      })
      .then(() => {
        console.log(
          'emit to room',
          DashboardEmitEvents.SendAvailableMeetingInstance,
        );
        this.emitToRoom(
          `waitingRoom:${message.templateId}`,
          DashboardEmitEvents.SendAvailableMeetingInstance,
          message,
        );
      });

    return {
      success: true,
    };
  }

  @SubscribeMessage(DashboardSubscribeEvents.OnMeetingAvailable)
  async sendMeetingAvailable(
    @MessageBody() message: { templateId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.debug(`Emit meeting available ${message.templateId}`);

    this.broadcastToRoom(
      socket,
      `waitingRoom:${message.templateId}`,
      DashboardEmitEvents.SendMeetingAvailable,
      message,
    );
  }

  @SubscribeMessage(DashboardSubscribeEvents.OnSendEnterWaitingRoom)
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

  @SubscribeMessage(DashboardSubscribeEvents.OnGetDashboardNotifications)
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

  @SubscribeMessage(DashboardSubscribeEvents.OnReadDashboardNotifications)
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
