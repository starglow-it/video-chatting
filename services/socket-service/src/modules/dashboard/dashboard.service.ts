import { Injectable } from '@nestjs/common';
import { CoreService } from '../../services/core/core.service';
import { DashboardBrokerPatterns } from '@shared/patterns/dashboard';
import {
  CreateNotificationPayload,
  GetNotificationsPayload,
  ReadNotificationsPayload,
} from '@shared/broker-payloads/dashboard';

@Injectable()
export class DashboardService {
  constructor(private coreService: CoreService) {}

  async createNotification(payload: CreateNotificationPayload) {
    const pattern = { cmd: DashboardBrokerPatterns.CreateNotification };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getNotifications(payload: GetNotificationsPayload) {
    const pattern = { cmd: DashboardBrokerPatterns.GetNotifications };

    return this.coreService.sendCustom(pattern, payload);
  }

  async readNotifications(payload: ReadNotificationsPayload) {
    const pattern = { cmd: DashboardBrokerPatterns.ReadNotifications };

    return this.coreService.sendCustom(pattern, payload);
  }
}
