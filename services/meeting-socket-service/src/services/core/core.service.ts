import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from '@shared/providers';
import { UserBrokerPatterns } from '@shared/patterns/users';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import {
  FindUserByIdPayload,
  FindUsersByIdPayload,
  UpdateUserPayload,
} from '@shared/broker-payloads/users';
import { TemplateBrokerPatterns } from '@shared/patterns/templates';
import { GetUserTemplateByIdPayload } from '@shared/broker-payloads/templates';
import { UpdateMeetingInstancePayload } from '@shared/broker-payloads/meetings';
import { MeetingBrokerPatterns } from '@shared/patterns/meetings';

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

  async updateUser(payload: UpdateUserPayload): Promise<ICommonUserDTO> {
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
}
