import { Inject, Injectable } from '@nestjs/common';
import { SCALING_PROVIDER } from '@shared/providers';
import { ClientProxy } from '@nestjs/microservices';
import { CreateServerPayload } from '@shared/broker-payloads/meetings';
import { ScalingBrokerPatterns } from '@shared/patterns/scaling';
import { ICommonMeetingInstance } from '@shared/interfaces/common-instance-meeting.interface';

@Injectable()
export class ScalingService {
  constructor(@Inject(SCALING_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async createServer(payload?: CreateServerPayload): Promise<{
    instanceId: ICommonMeetingInstance['instanceId'];
    serverIp: ICommonMeetingInstance['serverIp'];
  }> {
    const pattern = { cmd: ScalingBrokerPatterns.CreateServer };

    return this.client.send(pattern, payload).toPromise();
  }
}
