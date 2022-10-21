import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from 'shared';
import { MeetingBrokerPatterns } from 'shared';
import {
  CreateMeetingInstancePayload,
  DeleteMeetingInstancePayload,
  GetMeetingInstancePayload,
  UpdateMeetingInstancePayload,
} from 'shared';
import { ICommonMeetingInstance } from 'shared';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async updateMeetingInstance(
    payload: UpdateMeetingInstancePayload,
  ): Promise<boolean> {
    const pattern = { cmd: MeetingBrokerPatterns.UpdateMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }

  async getMeetingInstances(
    payload: GetMeetingInstancePayload,
  ): Promise<ICommonMeetingInstance[]> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }

  async deleteMeetingInstance(
    payload: DeleteMeetingInstancePayload,
  ): Promise<ICommonMeetingInstance[]> {
    const pattern = { cmd: MeetingBrokerPatterns.DeleteMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }

  async createMeetingInstance(
    payload: CreateMeetingInstancePayload,
  ): Promise<ICommonMeetingInstance[]> {
    const pattern = { cmd: MeetingBrokerPatterns.CreateMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }
}
