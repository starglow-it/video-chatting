import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { Stripe } from 'stripe';
import { ConfigClientService } from '../config/config.service';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

@Injectable()
export class PaymentsService {
  constructor(
    private configService: ConfigClientService,
    @InjectStripe() private readonly stripeClient: Stripe,
  ) {}

  async createExpressAccount({ email }: { email: string }) {
    return this.stripeClient.accounts.create({
      type: 'express',
      email,
      capabilities: {
        transfers: {
          requested: true,
        },
        card_payments: {
          requested: true,
        },
      },
    });
  }

  async createExpressAccountLink({ accountId }: { accountId: string }) {
    const frontendUrl = await this.configService.get('frontendUrl');

    return this.stripeClient.accountLinks.create({
      account: accountId,
      refresh_url: `${frontendUrl}/dashboard/profile`,
      return_url: `${frontendUrl}/dashboard/profile`,
      type: 'account_onboarding',
    });
  }

  async getExpressAccount({ accountId }: { accountId: string }) {
    return this.stripeClient.accounts.retrieve(accountId);
  }

  async createExpressAccountLoginLink({ accountId }: { accountId: string }) {
    return this.stripeClient.accounts.createLoginLink(accountId);
  }

  async deleteExpressAccount({ accountId }: { accountId: string }) {
    return this.stripeClient.accounts.del(accountId);
  }

  async createPaymentIntent({
    templatePrice,
    templateCurrency,
    stripeAccountId,
    platformFee,
  }: {
    platformFee: number;
    templatePrice: number;
    templateCurrency: string;
    stripeAccountId: ICommonUserDTO['stripeAccountId'];
  }) {
    const amount = templatePrice * 100;

    return this.stripeClient.paymentIntents.create({
      amount,
      currency: templateCurrency,
      transfer_data: {
        amount: amount - amount * platformFee,
        destination: stripeAccountId,
      },
    });
  }

  async getPaymentIntent({ paymentIntentId }: { paymentIntentId: string }) {
    return this.stripeClient.paymentIntents.retrieve(paymentIntentId);
  }

  async cancelPaymentIntent({ paymentIntentId }: { paymentIntentId: string }) {
    return this.stripeClient.paymentIntents.cancel(paymentIntentId);
  }

  async createWebhookEvent({ body, sig }): Promise<Stripe.Event | undefined> {
    try {
      const secret = await this.configService.get('stripeWebhookSecret');

      return this.stripeClient.webhooks.constructEvent(body, sig, secret);
    } catch (e) {
      console.log(`⚠️  Webhook signature verification failed.`, e.message);
      return;
    }
  }

  async getStripeProducts() {
    return this.stripeClient.products.list({
      active: true,
    });
  }

  async getStripeProduct(productId) {
    return this.stripeClient.products.retrieve(productId);
  }

  async getStripeCheckoutSession(priceId, basePath, meetingToken) {
    const frontendUrl = await this.configService.get('frontendUrl');

    const meetingPath = `/meeting/${meetingToken}`;

    const baseUrl = `${frontendUrl}/${meetingToken ? meetingPath : basePath}`;

    return this.stripeClient.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}?canceled=true`,
    });
  }

  async getStripePrice(priceId) {
    return this.stripeClient.prices.retrieve(priceId);
  }

  async getSubscription(subscriptionId) {
    return this.stripeClient.subscriptions.retrieve(subscriptionId);
  }

  async createSessionPortal(customer, returnUrl) {
    return this.stripeClient.billingPortal.sessions.create({
      customer,
      return_url: returnUrl,
    });
  }
}
