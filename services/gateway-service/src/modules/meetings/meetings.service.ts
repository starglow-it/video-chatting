import { Injectable } from '@nestjs/common';
import { CoreService } from '../../services/core/core.service';
import {
  AssignMeetingInstancePayload,
  CreateMeetingAvatarPayload,
  EntityList,
  GetMeetingAvatarsPayload,
  IMeetingAvatar,
  IUserTemplate,
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

  async getMeetingAvatars(
    payload: GetMeetingAvatarsPayload,
  ): Promise<EntityList<IMeetingAvatar>> {
    const pattern = { cmd: MeetingBrokerPatterns.GetMeetingAvatars };
    return this.coreService.sendCustom(pattern, payload);
  }

  async createMeetingAvatar(
    payload: CreateMeetingAvatarPayload,
  ): Promise<IMeetingAvatar> {
    const pattern = { cmd: MeetingBrokerPatterns.CreateMeetingAvatar };
    return this.coreService.sendCustom(pattern, payload);
  }
}
