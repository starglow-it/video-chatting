import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PAYMENTS_PROVIDER } from 'shared-const';
import { PaymentsBrokerPatterns } from 'shared-const';
import {
  CancelPaymentIntentPayload,
  CancelUserSubscriptionPayload,
  CreatePaymentIntentPayload,
  CreateStripeAccountLinkPayload,
  CreateStripeExpressAccountPayload,
  DeleteStripeExpressAccountPayload,
  GetProductCheckoutSessionPayload,
  GetStripeCheckoutSessionPayload,
  GetStripePortalSessionPayload,
  GetStripeSubscriptionPayload,
  LoginStripeExpressAccountPayload,
} from 'shared-types';

@Injectable()
export class PaymentsService {
  constructor(@Inject(PAYMENTS_PROVIDER) private client: ClientProxy) {}

  async createStripeExpressAccount(payload: CreateStripeExpressAccountPayload) {
    const pattern = { cmd: PaymentsBrokerPatterns.CreateStripeExpressAccount };

    return this.client.send(pattern, payload).toPromise();
  }

  async createAccountLink(payload: CreateStripeAccountLinkPayload) {
    const pattern = { cmd: PaymentsBrokerPatterns.CreateStripeAccountLink };

    return this.client.send(pattern, payload).toPromise();
  }

  async loginStripeExpressAccount(payload: LoginStripeExpressAccountPayload) {
    const pattern = { cmd: PaymentsBrokerPatterns.LoginStripeExpressAccount };

    return this.client.send(pattern, payload).toPromise();
  }

  async deleteStripeExpressAccount(payload: DeleteStripeExpressAccountPayload) {
    const pattern = { cmd: PaymentsBrokerPatterns.DeleteStripeExpressAccount };

    return this.client.send(pattern, payload).toPromise();
  }

  async createPaymentIntent(payload: CreatePaymentIntentPayload) {
    const pattern = { cmd: PaymentsBrokerPatterns.CreatePaymentIntent };

    return this.client.send(pattern, payload).toPromise();
  }

  async cancelPaymentIntent(payload: CancelPaymentIntentPayload) {
    const pattern = { cmd: PaymentsBrokerPatterns.CancelPaymentIntent };

    return this.client.send(pattern, payload).toPromise();
  }

  async getStripeProducts(payload?: unknown) {
    const pattern = {
      cmd: PaymentsBrokerPatterns.GetStripeSubscriptionProducts,
    };

    return this.client.send(pattern, payload || {}).toPromise();
  }

  async getCheckoutSession(payload: GetStripeCheckoutSessionPayload) {
    const pattern = { cmd: PaymentsBrokerPatterns.GetStripeCheckoutSession };

    return this.client.send(pattern, payload).toPromise();
  }

  async getPortalSession(payload: GetStripePortalSessionPayload) {
    const pattern = { cmd: PaymentsBrokerPatterns.GetStripePortalSession };

    return this.client.send(pattern, payload).toPromise();
  }

  async getStripeSubscription(payload: GetStripeSubscriptionPayload) {
    const pattern = { cmd: PaymentsBrokerPatterns.GetStripeSubscription };

    return this.client.send(pattern, payload).toPromise();
  }

  async getProductCheckoutSession(payload: GetProductCheckoutSessionPayload) {
    const pattern = {
      cmd: PaymentsBrokerPatterns.GetStripeProductCheckoutSession,
    };

    return this.client.send(pattern, payload).toPromise();
  }

  async cancelUserSubscription(payload: CancelUserSubscriptionPayload) {
    const pattern = {
      cmd: PaymentsBrokerPatterns.CancelUserSubscription,
    };

    return this.client.send(pattern, payload).toPromise();
  }
}
