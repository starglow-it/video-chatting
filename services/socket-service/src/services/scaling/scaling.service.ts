import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { SCALING_PROVIDER } from 'shared';
import { ScalingBrokerPatterns } from 'shared';
import { WaitForAvailableServerPayload } from 'shared';

@Injectable()
export class ScalingService {
  constructor(@Inject(SCALING_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async waitForAvailableServer(
    payload: WaitForAvailableServerPayload,
  ): Promise<boolean> {
    const pattern = { cmd: ScalingBrokerPatterns.WaitForAvailableServer };

    return this.client.send(pattern, payload).toPromise();
  }
}
