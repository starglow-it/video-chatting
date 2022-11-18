import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  ICommonUser,
  IUserTemplate,
  UpdateRoomRatingStatisticPayload,
  UpdateMeetingInstancePayload,
  GetUserTemplateByIdPayload,
  FindUserByIdPayload,
  FindUsersByIdPayload,
  UpdateUserPayload,
  ICommonTemplate,
  UpdateUserProfileStatisticPayload,
} from 'shared-types';
import {
  StatisticBrokerPatterns,
  TemplateBrokerPatterns,
  MeetingBrokerPatterns,
  UserBrokerPatterns,
  CORE_PROVIDER,
} from 'shared-const';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async findUserById(payload: FindUserByIdPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.FindUserById };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async findUsersById(payload: FindUsersByIdPayload): Promise<ICommonUser[]> {
    const pattern = { cmd: UserBrokerPatterns.FindUsersById };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async findMeetingTemplate(
    payload: GetUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUserTemplate };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async findMeetingTemplateById(payload: {
    id: IUserTemplate['id'];
  }): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUserTemplateById };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async findCommonTemplateByTemplateId(payload: {
    templateId: ICommonTemplate['templateId'];
  }): Promise<ICommonTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplate };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async updateUser(payload: UpdateUserPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.UpdateUser };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async sendCustom(pattern, payload) {
    return firstValueFrom(this.client.send(pattern, payload));
  }

  async updateMeetingInstance(
    payload: UpdateMeetingInstancePayload,
  ): Promise<boolean> {
    const pattern = { cmd: MeetingBrokerPatterns.UpdateMeetingInstance };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async updateRoomRatingStatistic(
    payload: UpdateRoomRatingStatisticPayload,
  ): Promise<any> {
    const pattern = {
      cmd: StatisticBrokerPatterns.UpdateRoomRatingStatistic,
    };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async updateUserProfileStatistic(
    payload: UpdateUserProfileStatisticPayload,
  ): Promise<any> {
    const pattern = {
      cmd: StatisticBrokerPatterns.UpdateUserProfileStatistic,
    };

    return firstValueFrom(this.client.send(pattern, payload));
  }
}
