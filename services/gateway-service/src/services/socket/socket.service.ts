import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { SOCKET_PROVIDER, SocketBrokerPatterns } from 'shared-const';
import { KickUserFromMeetingPayload } from 'shared-types';

@Injectable()
export class SocketService {
  constructor(@Inject(SOCKET_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async kickUserFromMeeting(
    payload: KickUserFromMeetingPayload,
  ): Promise<void> {
    const pattern = { cmd: SocketBrokerPatterns.KickUserFromMeeting };

    return this.client.send(pattern, payload).toPromise();
  }
}
