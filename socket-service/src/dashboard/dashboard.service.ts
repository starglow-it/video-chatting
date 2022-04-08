import { Injectable } from '@nestjs/common';
import { CoreService } from '../core/core.service';
import {
  CREATE_DASHBOARD_NOTIFICATION,
  GET_DASHBOARD_NOTIFICATIONS,
  READ_DASHBOARD_NOTIFICATIONS,
} from '@shared/patterns/dashboard';
import { ICreateDashboardNotification } from '@shared/interfaces/create-dashboard-notification.interface';
import { IDashboardNotification } from '@shared/interfaces/dashboard-notification.interface';

@Injectable()
export class DashboardService {
  constructor(private coreService: CoreService) {}

  async createNotification(data: ICreateDashboardNotification) {
    const pattern = { cmd: CREATE_DASHBOARD_NOTIFICATION };

    return this.coreService.sendCustom(pattern, data);
  }

  async getNotifications(data: { receiverId: string }) {
    const pattern = { cmd: GET_DASHBOARD_NOTIFICATIONS };

    return this.coreService.sendCustom(pattern, data);
  }

  async readNotifications(data: {
    receiverId: string;
    notifications: IDashboardNotification['id'][];
  }) {
    const pattern = { cmd: READ_DASHBOARD_NOTIFICATIONS };

    return this.coreService.sendCustom(pattern, data);
  }
}
