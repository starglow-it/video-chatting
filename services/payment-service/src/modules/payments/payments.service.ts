import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { Stripe } from 'stripe';
import { ConfigClientService } from '../../services/config/config.service';
import { ICommonUserDTO } from 'shared';

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
        amount: Math.floor(amount - amount * platformFee),
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

  async createExpressWebhookEvent({
    body,
    sig,
  }): Promise<Stripe.Event | undefined> {
    try {
      const secret = await this.configService.get('stripeExpressWebhookSecret');

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

  async getStripeCheckoutSession({
    paymentMode,
    priceId,
    basePath,
    meetingToken,
    customerEmail,
    customer,
  }: {
    paymentMode: Stripe.Checkout.SessionCreateParams.Mode;
    priceId: string;
    basePath: string;
    meetingToken?: string;
    customerEmail: string;
    customer?: string;
  }) {
    const frontendUrl = await this.configService.get('frontendUrl');

    const meetingPath = `/room/${meetingToken}`;

    const baseUrl = `${frontendUrl}/${meetingToken ? meetingPath : basePath}`;

    return this.stripeClient.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      ...(customer ? { customer } : { customer_email: customerEmail }),
      mode: paymentMode,
      allow_promotion_codes: true,
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

  async createProduct(productData: {
    name: string;
    priceInCents: number;
    description: string;
    type: 'subscription' | 'template';
  }) {
    const environment = await this.configService.get('environment');

    return this.stripeClient.products.create({
      name: productData.name,
      active: true,
      tax_code: 'txcd_10000000',
      default_price_data: {
        currency: 'usd',
        unit_amount: productData.priceInCents,
        ...(productData.type === 'subscription'
          ? {
              recurring: {
                interval: ['demo', 'production'].includes(environment)
                  ? 'month'
                  : 'day',
              },
            }
          : {}),
      },
      metadata: {
        type: productData.type,
      },
      description: productData.description,
    });
  }

  async updateProduct(productId, data) {
    return this.stripeClient.products.update(productId, {
      name: data.name,
      description: data.description,
    });
  }

  async getProduct(productId) {
    return this.stripeClient.products.retrieve(productId);
  }

  async getCustomer({ customerId }: { customerId: string }) {
    return this.stripeClient.customers.retrieve(customerId);
  }

  async getCheckoutSession(checkoutId) {
    return this.stripeClient.checkout.sessions.retrieve(checkoutId, {
      expand: ['line_items'],
    });
  }

  async getStripeSubscriptions(): Promise<Stripe.Product[]> {
    const allProducts = await this.stripeClient.products.list({
      active: true,
    });

    return allProducts.data.filter(
      (product) => product.metadata.type === 'subscription',
    );
  }

  async getStripeTemplates(): Promise<Stripe.Product[]> {
    const allProducts = await this.stripeClient.products.list({
      active: true,
    });

    return allProducts.data.filter(
      (product) => product.metadata.type === 'template',
    );
  }
}
