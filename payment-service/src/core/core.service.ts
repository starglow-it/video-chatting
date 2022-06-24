import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CORE_PROVIDER } from '@shared/providers';
import { GET_MEETING_DONATION } from "@shared/patterns/payments";

@Injectable()
export class CoreService {
  constructor(@Inject(CORE_PROVIDER) private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  async getMeetingDonation(data: { paymentIntentId: string; }) {
    const pattern = { cmd: GET_MEETING_DONATION };

    return this.client.send(pattern, data).toPromise();
  }
}
