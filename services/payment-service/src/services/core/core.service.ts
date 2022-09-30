import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from '@shared/providers';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { TemplateBrokerPatterns } from '@shared/patterns/templates';
import { UserBrokerPatterns } from '@shared/patterns/users';
import { AddTemplateToUserPayload } from '@shared/broker-payloads/templates';
import {
  FindUserPayload,
  UpdateUserPayload,
} from '@shared/broker-payloads/users';

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

  async addTemplateToUser(payload: AddTemplateToUserPayload): Promise<void> {
    const pattern = { cmd: TemplateBrokerPatterns.AddTemplateToUser };

    return this.client.send(pattern, payload).toPromise();
  }
}
