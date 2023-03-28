import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PAYMENTS_PROVIDER } from 'shared-const';
import { PaymentsBrokerPatterns } from 'shared-const';
import {
  CreateStripeTemplateProductPayload,
  DeleteTemplateStripeProductPayload,
  GetStripeChargesPayload,
  GetStripeTemplateProductByNamePayload,
  UpdateStripeTemplateProductPayload,
} from 'shared-types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {
  constructor(@Inject(PAYMENTS_PROVIDER) private client: ClientProxy) {}

  async createTemplateStripeProduct(
    payload: CreateStripeTemplateProductPayload,
  ) {
    const pattern = { cmd: PaymentsBrokerPatterns.CreateStripeTemplateProduct };

    return this.client.send(pattern, payload).toPromise();
  }

  async updateTemplateStripeProduct(
    payload: UpdateStripeTemplateProductPayload,
  ) {
    const pattern = { cmd: PaymentsBrokerPatterns.UpdateStripeTemplateProduct };

    return firstValueFrom(this.client.send(pattern, payload));
  }

  async getStripeTemplateProductByName(
    payload: GetStripeTemplateProductByNamePayload,
  ) {
    const pattern = {
      cmd: PaymentsBrokerPatterns.GetStripeTemplateProductByName,
    };

    return this.client.send(pattern, payload).toPromise();
  }

  async getStripeCharges(payload: GetStripeChargesPayload) {
    const pattern = {
      cmd: PaymentsBrokerPatterns.GetStripeCharges,
    };

    return this.client.send(pattern, payload).toPromise();
  }

  async deleteTemplateStripeProduct(
    payload: DeleteTemplateStripeProductPayload,
  ) {
    const pattern = {
      cmd: PaymentsBrokerPatterns.DeleteTemplateStripeProduct,
    };

    return this.client.send(pattern, payload).toPromise();
  }
}
