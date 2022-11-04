import { Inject, Injectable } from '@nestjs/common';
import { SCALING_PROVIDER } from 'shared-const';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ScalingService {
  constructor(@Inject(SCALING_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }
}
