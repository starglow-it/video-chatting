import { Inject, Injectable } from '@nestjs/common';
import { SCALING_PROVIDER } from 'shared';
import { ClientProxy } from '@nestjs/microservices';
import { CreateServerPayload } from 'shared';
import { ScalingBrokerPatterns } from 'shared';
import { ICommonMeetingInstance } from 'shared';

@Injectable()
export class ScalingService {
  constructor(@Inject(SCALING_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async createServerInstance(payload?: CreateServerPayload): Promise<{
    instanceId: ICommonMeetingInstance['instanceId'];
    serverIp: ICommonMeetingInstance['serverIp'];
  }> {
    const pattern = { cmd: ScalingBrokerPatterns.CreateServer };

    return this.client.send(pattern, payload).toPromise();
  }
}
