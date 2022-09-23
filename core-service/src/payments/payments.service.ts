import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PAYMENTS_PROVIDER } from '@shared/providers';
import {
  CREATE_TEMPLATE_STRIPE_PRODUCT,
  GET_TEMPLATE_STRIPE_PRODUCT_BY_NAME,
} from '@shared/patterns/payments';

@Injectable()
export class PaymentsService {
  constructor(@Inject(PAYMENTS_PROVIDER) private client: ClientProxy) {}

  async createTemplateStripeProduct(data: {
    name: string;
    priceInCents: number;
    description: string;
  }) {
    const pattern = { cmd: CREATE_TEMPLATE_STRIPE_PRODUCT };

    return this.client.send(pattern, data).toPromise();
  }

  async getStripeTemplateProductByName(data: { name: string }) {
    const pattern = { cmd: GET_TEMPLATE_STRIPE_PRODUCT_BY_NAME };

    return this.client.send(pattern, data).toPromise();
  }
}
