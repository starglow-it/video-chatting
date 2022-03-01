import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NOTIFICATIONS_PROVIDER } from '@shared/providers';
import { SEND_EMAIL_PATTERN } from '@shared/patterns/notifications';

@Injectable()
export class NotificationsService {
  constructor(@Inject(NOTIFICATIONS_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async sendConfirmRegistrationEmail(data) {
    const pattern = { cmd: SEND_EMAIL_PATTERN };

    return this.client.send(pattern, data).toPromise();
  }
}
