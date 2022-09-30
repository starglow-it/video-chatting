import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PAYMENTS_PROVIDER } from '@shared/providers';
import { PaymentsBrokerPatterns } from '@shared/patterns/payments';
import { CreateStripeTemplateProductPayload } from '@shared/broker-payloads/payments';

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
