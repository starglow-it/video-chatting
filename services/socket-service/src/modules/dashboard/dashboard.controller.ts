import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { DashboardEmitEvents } from '../../const/socket-events/emitters/dashboard';
import { DashboardGateway } from './dashboard.gateway';

// shared
import {
  KickUserFromMeetingPayload,
  SendTrialExpiredNotificationPayload,
} from 'shared-types';
import { SocketBrokerPatterns } from 'shared-const';

@Controller('/dashboard')
export class DashboardController {
  constructor(private dashboardGateway: DashboardGateway) {}

  @MessagePattern({ cmd: SocketBrokerPatterns.SendTrialExpiredNotification })
  async createDashboardNotification(
    @Payload() { userId }: SendTrialExpiredNotificationPayload,
  ) {
    this.dashboardGateway.emitToRoom(
      `dashboard:${userId}`,
      DashboardEmitEvents.OnTrialExpired,
    );
  }

  @MessagePattern({ cmd: SocketBrokerPatterns.KickUserFromMeeting })
  async kickUserFromMeeting(
    @Payload() { userId, reason }: KickUserFromMeetingPayload,
  ) {
    this.dashboardGateway.emitToRoom(
      `dashboard:${userId}`,
      DashboardEmitEvents.KickUser,
      { reason },
    );
  }
}
