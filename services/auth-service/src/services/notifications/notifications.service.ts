import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NOTIFICATIONS_PROVIDER } from '@shared/providers';
import { NotificationsBrokerPatterns } from '@shared/broker-payloads/email';

@Injectable()
export class NotificationsService {
  constructor(@Inject(NOTIFICATIONS_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async sendEmail(payload) {
    const pattern = { cmd: NotificationsBrokerPatterns.SendEmail };

    return this.client.send(pattern, payload).toPromise();
  }
}
