import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from 'shared-const';
import {
  RoomStatisticBrokerPatterns,
  UserBrokerPatterns,
  TemplateBrokerPatterns,
} from 'shared-const';
import {
  ICommonUser,
  IncreaseRoomTransactionStatisticPayload,
  UpdateUserPayload,
  FindUserPayload,
  AddTemplateToUserPayload,
  GetCommonTemplatePayload,
  UpdateRoomRatingStatisticPayload,
} from 'shared-types';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async updateUser(payload: UpdateUserPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.UpdateUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUser(payload: FindUserPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.FindUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async getCommonTemplateById(
    payload: GetCommonTemplatePayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplateById };

    return this.client.send(pattern, payload).toPromise();
  }

  async getCommonTemplate(
    payload: GetCommonTemplatePayload,
  ): Promise<ICommonUser> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplate };

    return this.client.send(pattern, payload).toPromise();
  }

  async addTemplateToUser(payload: AddTemplateToUserPayload): Promise<void> {
    const pattern = { cmd: TemplateBrokerPatterns.AddTemplateToUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async increaseRoomTransactionStatistic(
    payload: IncreaseRoomTransactionStatisticPayload,
  ): Promise<void> {
    const pattern = {
      cmd: RoomStatisticBrokerPatterns.IncreaseRoomTransactionStatistic,
    };

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
