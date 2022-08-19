import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from '@shared/providers';
import { IUpdateProfile } from '@shared/interfaces/update-profile.interface';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { ADD_TEMPLATE_TO_USER } from '@shared/patterns/templates';
import { FIND_USER, UPDATE_USER } from '@shared/patterns/users';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async updateUser(data: {
    query: any;
    data: Partial<IUpdateProfile>;
  }): Promise<ICommonUserDTO> {
    const pattern = { cmd: UPDATE_USER };

    return this.client.send(pattern, data).toPromise();
  }

  async findUser(data: Partial<ICommonUserDTO>): Promise<ICommonUserDTO> {
    const pattern = { cmd: FIND_USER };

    return this.client.send(pattern, data).toPromise();
  }

  async addTemplateToUser(data: {
    productId: string;
    customerId: string;
  }): Promise<void> {
    const pattern = { cmd: ADD_TEMPLATE_TO_USER };

    return this.client.send(pattern, data).toPromise();
  }
}
