import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from 'shared-const';
import { UserTemplatesBrokerPatterns, UserBrokerPatterns } from 'shared-const';
import {
  IUserTemplate,
  ICommonUser,
  GetUserTemplateByIdPayload,
  FindUserByIdPayload,
  FindUsersByIdPayload,
  UpdateUserPayload,
} from 'shared-types';

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

  async findMeetingTemplateById(
    payload: GetUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.GetUserTemplateById };

    return this.client.send(pattern, payload).toPromise();
  }

  async findMeetingTemplate(payload: {
    id: IUserTemplate['id'];
  }): Promise<IUserTemplate> {
    const pattern = { cmd: UserTemplatesBrokerPatterns.GetUserTemplate };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateUser(payload: UpdateUserPayload): Promise<ICommonUser> {
    const pattern = { cmd: UserBrokerPatterns.UpdateUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async sendCustom(pattern, payload) {
    return this.client.send(pattern, payload).toPromise();
  }
}
