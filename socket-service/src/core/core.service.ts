import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from '@shared/providers';
import { FIND_USER_BY_ID } from '@shared/patterns/users';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { IUserTemplate } from '@shared/interfaces/user-template.interface';
import { GET_USER_TEMPLATE_BY_ID } from '@shared/patterns/templates';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async findUserById(data: {
    userId: ICommonUserDTO['id'];
  }): Promise<ICommonUserDTO> {
    const pattern = { cmd: FIND_USER_BY_ID };

    return this.client.send(pattern, data).toPromise();
  }

  async findMeetingTemplate(data: {
    id: IUserTemplate['id'];
  }): Promise<IUserTemplate> {
    const pattern = { cmd: GET_USER_TEMPLATE_BY_ID };

    return this.client.send(pattern, data).toPromise();
  }

  async sendCustom(pattern, data) {
    return this.client.send(pattern, data).toPromise();
  }
}
