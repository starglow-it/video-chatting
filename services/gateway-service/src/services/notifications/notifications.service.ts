import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATIONS_PROVIDER } from 'shared-const';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationsBrokerPatterns } from 'shared-const';
import { MonitoringService } from 'src/modules/monitoring/monitoring.service';
import { MessagesSendResponse, MonitoringEvent } from 'shared-types';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATIONS_PROVIDER) private client: ClientProxy,
    private readonly monitoringService: MonitoringService,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async sendEmail(data) {
    const statuses = ['sent', 'queued'];
    const messages = (await this.client
      .send(NotificationsBrokerPatterns.SendEmail, data)
      .toPromise()) as MessagesSendResponse[];
    const m = messages.find
      ? messages.find((item) => statuses.includes(item.status))
      : undefined;
    if (m) {
      await this.monitoringService.createMonitoring({
        event: MonitoringEvent.SendEmail,
        eventId: m._id,
      });
    }
    return messages;
  }
}
