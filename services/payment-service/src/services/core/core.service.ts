import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER, UserTemplatesBrokerPatterns } from 'shared-const';
import {
  StatisticBrokerPatterns,
  UserBrokerPatterns,
  TemplateBrokerPatterns,
} from 'shared-const';
import {
  ICommonUser,
  UpdateUserPayload,
  FindUserPayload,
  AddTemplateToUserPayload,
  GetCommonTemplatePayload,
  UpdateRoomRatingStatisticPayload,
  UpdateMonetizationStatisticPayload,
  ICommonTemplate,
  GetUserTemplateByIdPayload,
  IUserTemplate,
  UpdateUserProfileStatisticPayload,
  DeleteLeastUsedTemplatesPayload,
} from 'shared-types';
import { firstValueFrom } from 'rxjs';

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
  ): Promise<ICommonTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplate };

    return this.client.send(pattern, payload).toPromise();
  }

  async getUserTemplateById(
    payload: GetUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.GetUserTemplateById };

    return this.client.send(pattern, payload).toPromise();
  }

  async addTemplateToUser(payload: AddTemplateToUserPayload): Promise<void> {
    const pattern = { cmd: TemplateBrokerPatterns.AddTemplateToUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateRoomRatingStatistic(
    payload: UpdateRoomRatingStatisticPayload,
  ): Promise<any> {
    const pattern = {
      cmd: StatisticBrokerPatterns.UpdateRoomRatingStatistic,
    };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateMonetizationStatistic(
    payload: UpdateMonetizationStatisticPayload,
  ): Promise<any> {
    const pattern = {
      cmd: StatisticBrokerPatterns.UpdateMonetizationStatistic,
    };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateUserProfileStatistic(
    payload: UpdateUserProfileStatisticPayload,
  ): Promise<any> {
    const pattern = {
      cmd: StatisticBrokerPatterns.UpdateUserProfileStatistic,
    };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async deleteLeastUsedUserTemplates(
    payload: DeleteLeastUsedTemplatesPayload,
  ): Promise<any> {
    const pattern = {
      cmd: UserTemplatesBrokerPatterns.DeleteLeastUsedTemplates,
    };

    return this.client.send(pattern, payload).toPromise();
  }
}
