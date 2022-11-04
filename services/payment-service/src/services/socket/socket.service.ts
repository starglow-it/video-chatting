import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { SOCKET_PROVIDER, SocketBrokerPatterns } from 'shared-const';
import { ICommonUser, SendTrialExpiredNotificationPayload } from 'shared-types';

@Injectable()
export class SocketService {
  constructor(@Inject(SOCKET_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async sendTrialExpiredNotification(
    payload: SendTrialExpiredNotificationPayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: SocketBrokerPatterns.SendTrialExpiredNotification };

    return this.client.send(pattern, payload).toPromise();
  }
}
