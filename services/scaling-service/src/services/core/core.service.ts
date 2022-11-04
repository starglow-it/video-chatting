import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from 'shared-const';
import { MeetingBrokerPatterns } from 'shared-const';
import {
  CreateMeetingInstancePayload,
  DeleteMeetingInstancePayload,
  GetMeetingInstancePayload,
  UpdateMeetingInstancePayload,
  IMeetingInstance,
} from 'shared-types';

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
  ): Promise<IMeetingInstance[]> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }

  async deleteMeetingInstance(
    payload: DeleteMeetingInstancePayload,
  ): Promise<IMeetingInstance[]> {
    const pattern = { cmd: MeetingBrokerPatterns.DeleteMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }

  async createMeetingInstance(
    payload: CreateMeetingInstancePayload,
  ): Promise<IMeetingInstance[]> {
    const pattern = { cmd: MeetingBrokerPatterns.CreateMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }
}
