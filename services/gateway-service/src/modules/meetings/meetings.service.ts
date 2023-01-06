import { Injectable } from '@nestjs/common';
import { CoreService } from '../../services/core/core.service';
import {
  AssignMeetingInstancePayload, GetMeetingInstancePayload,
  GetMeetingPayload,
  IMeetingInstance,
  IUserTemplate,
  UpdateMeetingInstancePayload
} from 'shared-types';
import { MeetingBrokerPatterns } from 'shared-const';

@Injectable()
export class MeetingsService {
  constructor(private coreService: CoreService) {}

  async assignMeetingInstance(
    payload: AssignMeetingInstancePayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: MeetingBrokerPatterns.AssignMeetingInstance };

    return this.coreService.sendCustom(pattern, payload);
  }

  async findMeetingById(payload: GetMeetingPayload): Promise<IMeetingInstance> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeeting };

    return this.coreService.sendCustom(pattern, payload);
  }

  async updateMeetingInstance(
      payload: UpdateMeetingInstancePayload,
  ): Promise<boolean> {
    const pattern = { cmd: MeetingBrokerPatterns.UpdateMeetingInstance };

    return this.coreService.sendCustom(pattern, payload);
  }

  async getMeetingInstances(
      payload: GetMeetingInstancePayload,
  ): Promise<IMeetingInstance[]> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeetingInstance };

    return this.coreService.sendCustom(pattern, payload);
  }
}
