import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from 'shared-const';

import {
  ICommonUser,
  IUserTemplate,
  UpdateRoomRatingStatisticPayload,
  UpdateMeetingInstancePayload,
  GetUserTemplateByIdPayload,
  FindUserByIdPayload,
  FindUsersByIdPayload,
  UpdateUserPayload,
} from 'shared-types';
import {
  RoomStatisticBrokerPatterns,
  TemplateBrokerPatterns,
  MeetingBrokerPatterns,
  UserBrokerPatterns,
} from 'shared-const';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async findUserById(payload: FindUserByIdPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.FindUserById };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUsersById(payload: FindUsersByIdPayload): Promise<ICommonUser[]> {
    const pattern = { cmd: UserBrokerPatterns.FindUsersById };

    return this.client.send(pattern, payload).toPromise();
  }

  async findMeetingTemplate(
    payload: GetUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUserTemplate };

    return this.client.send(pattern, payload).toPromise();
  }

  async findMeetingTemplateById(payload: {
    id: IUserTemplate['id'];
  }): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUserTemplateById };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateUser(payload: UpdateUserPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.UpdateUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async sendCustom(pattern, payload) {
    return this.client.send(pattern, payload).toPromise();
  }

  async updateMeetingInstance(
    payload: UpdateMeetingInstancePayload,
  ): Promise<boolean> {
    const pattern = { cmd: MeetingBrokerPatterns.UpdateMeetingInstance };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateRoomRatingStatistic(
    payload: UpdateRoomRatingStatisticPayload,
  ): Promise<any> {
    const pattern = {
      cmd: RoomStatisticBrokerPatterns.UpdateRoomRatingStatistic,
    };

    return this.client.send(pattern, payload).toPromise();
  }
}
