import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import {
  CORE_PROVIDER,
} from 'shared-const';

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async sendCustom(pattern, payload) {
    return this.client.send(pattern, payload).toPromise();
  }
}
