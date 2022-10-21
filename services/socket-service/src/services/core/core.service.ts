import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from 'shared';
import { UserBrokerPatterns } from 'shared';
import { ICommonUserDTO } from 'shared';
import { IUserTemplate } from 'shared';
import {
  FindUserByIdPayload,
  FindUsersByIdPayload,
  UpdateUserPayload,
} from 'shared';
import { TemplateBrokerPatterns } from 'shared';
import { GetUserTemplateByIdPayload } from 'shared';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async findUserById(payload: FindUserByIdPayload): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.FindUserById };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUsersById(
    payload: FindUsersByIdPayload,
  ): Promise<ICommonUserDTO[]> {
    const pattern = { cmd: UserBrokerPatterns.FindUsersById };

    return this.client.send(pattern, payload).toPromise();
  }

  async findMeetingTemplateById(
    payload: GetUserTemplateByIdPayload,
  ): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUserTemplateById };

    return this.client.send(pattern, payload).toPromise();
  }

  async findMeetingTemplate(payload: {
    id: IUserTemplate['id'];
  }): Promise<IUserTemplate> {
    const pattern = { cmd: TemplateBrokerPatterns.GetUserTemplate };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateUser(payload: UpdateUserPayload): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.UpdateUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async sendCustom(pattern, payload) {
    return this.client.send(pattern, payload).toPromise();
  }
}
