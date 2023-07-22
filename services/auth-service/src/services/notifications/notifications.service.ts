import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NOTIFICATIONS_PROVIDER } from 'shared-const';
import { NotificationsBrokerPatterns } from 'shared-const';
import { CoreService } from '../core/core.service';
import { MessagesSendResponse, MonitoringEvent } from 'shared-types';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATIONS_PROVIDER) private client: ClientProxy,
    private readonly coreService: CoreService
  ) { }

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async sendEmail(payload) {
    const pattern = { cmd: NotificationsBrokerPatterns.SendEmail };
    const messages = await this.client.send(pattern, payload).toPromise() as MessagesSendResponse[];
    const m = messages.find ? messages.find(item => item.status === 'sent') : undefined;
    console.log(m);
    
    if (m) {
      await this.coreService.createMonitoring({
        event: MonitoringEvent.SendEmail,
        eventId: m._id
      });
    }
    return messages;
  }
}
