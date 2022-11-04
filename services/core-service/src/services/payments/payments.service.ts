import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PAYMENTS_PROVIDER } from 'shared-const';
import { PaymentsBrokerPatterns } from 'shared-const';
import { CreateStripeTemplateProductPayload } from 'shared-types';

@Injectable()
export class PaymentsService {
  constructor(@Inject(PAYMENTS_PROVIDER) private client: ClientProxy) {}

  async createTemplateStripeProduct(
    payload: CreateStripeTemplateProductPayload,
  ) {
    const pattern = { cmd: PaymentsBrokerPatterns.CreateStripeTemplateProduct };

    return this.client.send(pattern, payload).toPromise();
  }

  async getStripeTemplateProductByName(payload: { name: string }) {
    const pattern = {
      cmd: PaymentsBrokerPatterns.GetStripeTemplateProductByName,
    };

    return this.client.send(pattern, payload).toPromise();
  }
}
