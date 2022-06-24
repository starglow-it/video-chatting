import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PAYMENTS_PROVIDER } from '@shared/providers';
import {
  CANCEL_PAYMENT_INTENT,
  CREATE_PAYMENT_INTENT,
  CREATE_STRIPE_EXPRESS_ACCOUNT,
  DELETE_STRIPE_EXPRESS_ACCOUNT,
  HANDLE_WEBHOOK,
  LOGIN_STRIPE_EXPRESS_ACCOUNT,
} from '@shared/patterns/payments';

@Injectable()
export class PaymentsService {
  constructor(@Inject(PAYMENTS_PROVIDER) private client: ClientProxy) {}

  async createStripeExpressAccount(data: any) {
    const pattern = { cmd: CREATE_STRIPE_EXPRESS_ACCOUNT };

    return this.client.send(pattern, data).toPromise();
  }

  async loginStripeExpressAccount(data: any) {
    const pattern = { cmd: LOGIN_STRIPE_EXPRESS_ACCOUNT };

    return this.client.send(pattern, data).toPromise();
  }

  async deleteStripeExpressAccount(data: any) {
    const pattern = { cmd: DELETE_STRIPE_EXPRESS_ACCOUNT };

    return this.client.send(pattern, data).toPromise();
  }

  async createPaymentIntent(data: any) {
    const pattern = { cmd: CREATE_PAYMENT_INTENT };

    return this.client.send(pattern, data).toPromise();
  }

  async cancelPaymentIntent(data: any) {
    const pattern = { cmd: CANCEL_PAYMENT_INTENT };

    return this.client.send(pattern, data).toPromise();
  }

  async handleWebhook(data: any) {
    const pattern = { cmd: HANDLE_WEBHOOK };

    return this.client.send(pattern, data).toPromise();
  }
}
