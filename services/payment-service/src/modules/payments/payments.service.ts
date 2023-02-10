import { Injectable, Logger } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { Stripe } from 'stripe';
import { ConfigClientService } from '../../services/config/config.service';
import {
  CreatePaymentIntentPayload,
  DeleteTemplateStripeProductPayload,
} from 'shared-types';
import { parseBoolean } from 'shared-utils';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

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
    templateId,
  }: CreatePaymentIntentPayload) {
    const amount = templatePrice * 100;

    return this.stripeClient.paymentIntents.create({
      amount,
      currency: templateCurrency,
      transfer_data: {
        amount: Math.floor(amount - amount * platformFee),
        destination: stripeAccountId,
      },
      metadata: {
        templateId,
        isTransactionCharge: 1,
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
    cancelPath,
    meetingToken,
    customerEmail,
    customer,
    trialPeriodEndTimestamp,
    templateId,
    userId,
  }: {
    paymentMode: Stripe.Checkout.SessionCreateParams.Mode;
    priceId: string;
    basePath: string;
    cancelPath?: string;
    templateId?: string;
    meetingToken?: string;
    customerEmail: string;
    customer?: string;
    trialPeriodEndTimestamp?: number;
    userId?: string;
  }) {
    const frontendUrl = await this.configService.get('frontendUrl');

    const meetingPath = `/room/${meetingToken}`;

    const cancelUrl = new URL(
      `${frontendUrl}/${meetingToken ? meetingPath : cancelPath ?? basePath}`,
    );
    const successUrl = new URL(
      `${frontendUrl}/${meetingToken ? meetingPath : basePath}`,
    );

    cancelUrl.searchParams.set('canceled', 'true');
    successUrl.searchParams.set('success', 'true');
    successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');

    const metadata = {
      templateId,
      userId,
      isRoomPurchase: templateId ? 1 : 0,
      isSubscriptionPurchase: paymentMode === 'subscription' ? 1 : 0,
    };

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
      client_reference_id: customer,
      allow_promotion_codes: true,
      success_url: successUrl.href,
      cancel_url: cancelUrl.href,
      ...(paymentMode === 'subscription'
        ? {
            subscription_data: {
              trial_period_days: trialPeriodEndTimestamp,
              metadata,
            },
          }
        : {}),
      ...(paymentMode === 'subscription'
        ? {}
        : {
            payment_intent_data: {
              metadata,
            },
          }),
      metadata,
      ...(paymentMode === 'subscription'
        ? { payment_method_collection: 'if_required' }
        : {}),
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

    const product = await this.stripeClient.products.create({
      name: productData.name,
      active: true,
      tax_code: 'txcd_10000000',
      metadata: {
        type: productData.type,
      },
      description: productData.description,
    });

    await this.stripeClient.prices.create({
      product: product.id,
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
    });

    return product;
  }

  async updateProduct(productId, data) {
    const updatedProduct = await this.stripeClient.products.update(productId, {
      name: data.name,
      description: data.description,
    });

    if (data.priceInCents) {
      const price = await this.getProductPrice(productId);

      await this.stripeClient.prices.update(price.id, { active: false });

      await this.stripeClient.prices.create({
        product: productId,
        currency: 'usd',
        unit_amount: data.priceInCents,
      });
    }

    return updatedProduct;
  }

  async getProduct(productId) {
    return this.stripeClient.products.retrieve(productId);
  }

  async getProductPrice(productId) {
    const prices = await this.stripeClient.prices.search({
      query: `product:"${productId}"`,
    });

    return prices.data[0];
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

  async cancelStripeSubscription({ subscriptionId }): Promise<void> {
    if (subscriptionId) {
      await this.stripeClient.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      this.logger.log(
        '[cancelStripeSubscription]: no subscription id was provided',
      );
    }

    return;
  }

  async updateSubscription({
    subscriptionId,
    options,
  }: {
    subscriptionId: string;
    options: {
      trialEnd?: Stripe.SubscriptionUpdateParams['trial_end'];
      cancelAtPeriodEnd?: Stripe.SubscriptionUpdateParams['cancel_at_period_end'];
    };
  }) {
    return this.stripeClient.subscriptions.update(subscriptionId, {
      trial_end: options.trialEnd,
      cancel_at_period_end: options.cancelAtPeriodEnd,
    });
  }

  async getCharges({ time }: { time: number }) {
    const options = {
      limit: 100,
      created: {
        gt: Math.floor(time / 1000),
      },
    };

    let charges = [];

    for await (const charge of this.stripeClient.charges.list(options)) {
      charges.push(charge);
    }

    return charges.reduce((acc, chargeAmount) => acc + chargeAmount, 0);
  }

  async getSubscriptionCharges({ time }: { time: number }) {
    const options = {
      limit: 100,
      created: {
        gt: Math.floor(time / 1000),
      },
    };

    let paymentIntents = [];

    for await (const charge of this.stripeClient.charges.list(options)) {
      if (charge.invoice) {
        paymentIntents.push(charge.amount);
      }
    }

    return paymentIntents.reduce((acc, chargeAmount) => acc + chargeAmount, 0);
  }

  async getTransactionsCharges({ time }: { time: number }) {
    const options = {
      limit: 100,
      created: {
        gt: Math.floor(time / 1000),
      },
    };

    let transactionCharges = [];

    for await (const charge of this.stripeClient.charges.list(options)) {
      if (
        (Boolean(charge?.transfer_data?.destination) ||
          parseBoolean(charge?.metadata?.isTransactionCharge, false)) &&
        charge.status === 'succeeded'
      ) {
        transactionCharges.push(charge.amount);
      }
    }

    return transactionCharges.reduce(
      (acc, chargeAmount) => acc + chargeAmount,
      0,
    );
  }

  async getRoomsPurchaseCharges({ time }: { time: number }) {
    const options = {
      limit: 100,
      created: {
        gt: Math.floor(time / 1000),
      },
    };

    let roomPurchaseCharges = [];

    for await (const charge of this.stripeClient.charges.list(options)) {
      if (
        parseBoolean(charge?.metadata?.isRoomPurchase, false) &&
        charge.status === 'succeeded'
      ) {
        roomPurchaseCharges.push(charge.amount);
      }
    }

    return roomPurchaseCharges.reduce(
      (acc, chargeAmount) => acc + chargeAmount,
      0,
    );
  }

  async deleteStripeProduct({
    productId,
  }: DeleteTemplateStripeProductPayload): Promise<void> {
    try {
      await this.stripeClient.products.del(productId);

      return;
    } catch (e) {
      await this.stripeClient.products.update(productId, { active: false });
    }
  }
}
