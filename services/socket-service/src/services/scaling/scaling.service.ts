import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { SCALING_PROVIDER } from 'shared-const';

@Injectable()
export class ScalingService {
  constructor(@Inject(SCALING_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }
}
