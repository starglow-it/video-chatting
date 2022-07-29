import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from '@shared/providers';
import {IUpdateProfile} from "@shared/interfaces/update-profile.interface";
import {ICommonUserDTO} from "@shared/interfaces/common-user.interface";
import {FIND_USER, UPDATE_USER} from "@shared/patterns/users";

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

  async findUser(data: {
    query: Partial<ICommonUserDTO>;
  }): Promise<ICommonUserDTO> {
    const pattern = { cmd: FIND_USER };

    return this.client.send(pattern, data).toPromise();
  }
}
