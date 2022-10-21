import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from 'shared';
import { ICommonUserDTO } from 'shared';
import { TemplateBrokerPatterns } from 'shared';
import { UserBrokerPatterns } from 'shared';
import { AddTemplateToUserPayload, GetCommonTemplatePayload } from 'shared';
import { FindUserPayload, UpdateUserPayload } from 'shared';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async updateUser(payload: UpdateUserPayload): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.UpdateUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async findUser(payload: FindUserPayload): Promise<ICommonUserDTO> {
    const pattern = { cmd: UserBrokerPatterns.FindUser };

    return this.client.send(pattern, payload).toPromise();
  }

  async getCommonTemplateById(
    payload: GetCommonTemplatePayload,
  ): Promise<ICommonUserDTO> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplateById };

    return this.client.send(pattern, payload).toPromise();
  }

  async getCommonTemplate(
    payload: GetCommonTemplatePayload,
  ): Promise<ICommonUserDTO> {
    const pattern = { cmd: TemplateBrokerPatterns.GetCommonTemplate };

    return this.client.send(pattern, payload).toPromise();
  }

  async addTemplateToUser(payload: AddTemplateToUserPayload): Promise<void> {
    const pattern = { cmd: TemplateBrokerPatterns.AddTemplateToUser };

    return this.client.send(pattern, payload).toPromise();
  }
}
