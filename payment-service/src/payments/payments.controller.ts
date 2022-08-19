import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Stripe } from 'stripe';

// patterns
import {
  CANCEL_PAYMENT_INTENT,
  CREATE_PAYMENT_INTENT,
  CREATE_STRIPE_EXPRESS_ACCOUNT,
  DELETE_STRIPE_EXPRESS_ACCOUNT,
  LOGIN_STRIPE_EXPRESS_ACCOUNT,
  HANDLE_WEBHOOK,
  CREATE_STRIPE_ACCOUNT_LINK,
  GET_STRIPE_CHECKOUT_SESSION,
  GET_STRIPE_PORTAL_SESSION,
  GET_STRIPE_SUBSCRIPTION,
  HANDLE_EXPRESS_WEBHOOK,
  GET_TEMPLATE_STRIPE_PRODUCT,
  CREATE_TEMPLATE_STRIPE_PRODUCT,
  GET_STRIPE_PRODUCT_CHECKOUT_SESSION,
  GET_STRIPE_SUBSCRIPTIONS_PRODUCTS,
  GET_STRIPE_TEMPLATES_PRODUCTS,
} from '@shared/patterns/payments';

// services
import { ConfigClientService } from '../config/config.service';
import { PaymentsService } from './payments.service';
import { CoreService } from '../core/core.service';
import { NotificationsService } from '../notifications/notifications.service';

// const
import { emailTemplates } from '@shared/const/email-templates.const';
import { plans } from '@shared/const/subscriptions.const';
import { PAYMENTS_SERVICE } from '@shared/const/services.const';
import { PAYMENTS_SCOPE } from '@shared/const/api-scopes.const';

// interfaces
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

// utils
import { addMonthsCustom } from '../utils/dates/addMonths';
import { addDaysCustom } from '../utils/dates/addDaysCustom';
import { executePromiseQueue } from '../utils/executePromiseQueue';

@Controller(PAYMENTS_SCOPE)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private configService: ConfigClientService,
    private notificationsService: NotificationsService,
    private paymentService: PaymentsService,
    private coreService: CoreService,
  ) {}

  @MessagePattern({ cmd: CREATE_STRIPE_EXPRESS_ACCOUNT })
  async createStripeExpressAccount(
    @Payload() data: { accountId: string; email: string },
  ) {
    try {
      this.logger.log({
        message: `createStripeExpressAccount input payload`,
        ctx: data,
      });

      if (!data.accountId) {
        const account = await this.paymentService.createExpressAccount({
          email: data.email,
        });

        const accountLink = await this.paymentService.createExpressAccountLink({
          accountId: account.id,
        });

        return {
          accountId: account.id,
          accountLink: accountLink.url,
          accountEmail: account.email,
        };
      }

      return {
        accountId: '',
        accountLink: '',
      };
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: CREATE_STRIPE_ACCOUNT_LINK })
  async createStripeAccountLink(@Payload() data: { accountId: string }) {
    this.logger.log({
      message: `createStripeAccountLink input payload`,
      ctx: data,
    });

    const accountLink = await this.paymentService.createExpressAccountLink({
      accountId: data.accountId,
    });

    return {
      accountLink: accountLink.url,
    };
  }

  @MessagePattern({ cmd: LOGIN_STRIPE_EXPRESS_ACCOUNT })
  async loginStripeExpressAccount(@Payload() data: { accountId: string }) {
    try {
      this.logger.log({
        message: `loginStripeExpressAccount input payload`,
        ctx: data,
      });

      const existedAccount = await this.paymentService.getExpressAccount({
        accountId: data.accountId,
      });

      const loginLink = await this.paymentService.createExpressAccountLoginLink(
        { accountId: existedAccount.id },
      );

      return {
        accountLink: loginLink.url,
      };
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: DELETE_STRIPE_EXPRESS_ACCOUNT })
  async deleteStripeExpressAccount(@Payload() data: { accountId: string }) {
    try {
      this.logger.log({
        message: `deleteStripeExpressAccount input payload`,
        ctx: data,
      });

      await this.paymentService.deleteExpressAccount({
        accountId: data.accountId,
      });

      return;
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: CREATE_PAYMENT_INTENT })
  async createPaymentIntent(
    @Payload()
    data: {
      stripeSubscriptionId: string;
      templatePrice: number;
      templateCurrency: string;
      stripeAccountId: ICommonUserDTO['stripeAccountId'];
    },
  ) {
    try {
      this.logger.log({
        message: `createPaymentIntent input payload`,
        ctx: data,
      });

      let product = null;

      if (data.stripeSubscriptionId) {
        const subscription = await this.paymentService.getSubscription(
          data.stripeSubscriptionId,
        );

        product = await this.paymentService.getStripeProduct(
          // @ts-ignore
          subscription?.plan?.product,
        );
      }

      const plan = plans[product?.name || 'House'];

      const paymentIntent = await this.paymentService.createPaymentIntent({
        templatePrice: data.templatePrice,
        templateCurrency: data.templateCurrency,
        stripeAccountId: data.stripeAccountId,
        platformFee: plan.features.comissionFee,
      });

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      };
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: CANCEL_PAYMENT_INTENT })
  async cancelPaymentIntent(@Payload() data: { paymentIntentId: string }) {
    try {
      this.logger.log({
        message: `cancelPaymentIntent input payload`,
        ctx: data,
      });

      const paymentIntent = await this.paymentService.getPaymentIntent({
        paymentIntentId: data.paymentIntentId,
      });

      if (
        [
          'requires_payment_method',
          'requires_capture',
          'requires_confirmation',
          'requires_action',
          'processing',
        ].includes(paymentIntent.status)
      ) {
        await this.paymentService.cancelPaymentIntent({
          paymentIntentId: data.paymentIntentId,
        });
      }

      return;
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: GET_STRIPE_TEMPLATES_PRODUCTS })
  async getStripeTemplatesProducts() {
    try {
      const products = await this.paymentService.getStripeProducts();

      const pricesPromise = products.data.map(async (product) => {
        const price = await this.paymentService.getStripePrice(
          product.default_price,
        );

        return {
          product,
          price,
        };
      });

      return await Promise.all(pricesPromise);
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: GET_STRIPE_SUBSCRIPTIONS_PRODUCTS })
  async getStripeSubscriptionsProducts() {
    try {
      const subscriptionProducts =
        await this.paymentService.getStripeSubscriptions();

      const pricesPromise = subscriptionProducts.map(async (product) => {
        const price = await this.paymentService.getStripePrice(
          product.default_price,
        );

        return {
          product,
          price,
        };
      });

      return await Promise.all(pricesPromise);
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: GET_STRIPE_CHECKOUT_SESSION })
  async getStripeCheckoutSession(
    @Payload()
    data: {
      productId: string;
      meetingToken: string;
      baseUrl: string;
      customerEmail: string;
      customer: string;
    },
  ) {
    try {
      this.logger.log({
        message: `getStripeCheckoutSession input payload`,
        ctx: data,
      });

      const product = await this.paymentService.getStripeProduct(
        data.productId,
      );

      return this.paymentService.getStripeCheckoutSession({
        paymentMode: 'subscription',
        priceId: product.default_price as string,
        basePath: data.baseUrl,
        meetingToken: data.meetingToken,
        customerEmail: data.customerEmail,
        customer: data.customer,
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: GET_STRIPE_PORTAL_SESSION })
  async getStripePortalSession(@Payload() data: { subscriptionId: string }) {
    try {
      this.logger.log({
        message: `getStripePortalSession input payload`,
        ctx: data,
      });

      const frontendUrl = await this.configService.get('frontendUrl');

      const subscription = await this.paymentService.getSubscription(
        data.subscriptionId,
      );

      return this.paymentService.createSessionPortal(
        subscription.customer,
        `${frontendUrl}/dashboard/profile`,
      );
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: GET_STRIPE_SUBSCRIPTION })
  async getStripeSubscription(@Payload() data: { subscriptionId: string }) {
    try {
      this.logger.log({
        message: `getStripePortalSession input payload`,
        ctx: data,
      });

      return await this.paymentService.getSubscription(data.subscriptionId);
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: HANDLE_WEBHOOK })
  async handleWebhook(@Payload() data: { body: any; signature: string }) {
    try {
      const event = await this.paymentService.createWebhookEvent({
        body: Buffer.from(data.body.data),
        sig: data.signature,
      });

      switch (event.type) {
        case 'customer.created':
          const customer = event.data.object as Stripe.Customer;

          await this.coreService.updateUser({
            query: { email: customer.email },
            data: { stripeCustomerId: customer.id },
          });

          break;
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(
            event.data.object as Stripe.Subscription,
          );
          break;
        case 'invoice.payment_succeeded':
          await this.handleSubscriptionUpdate(
            event.data.object as Stripe.Invoice,
          );
          break;
        case 'invoice.paid':
          await this.handleFirstSubscription(
            event.data.object as Stripe.Invoice,
          );
          break;
        default:
          console.log(`Unhandled event type ${event.type}.`);
      }
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: HANDLE_EXPRESS_WEBHOOK })
  async handleExpressWebhook(
    @Payload() data: { body: any; signature: string },
  ) {
    try {
      const event = await this.paymentService.createExpressWebhookEvent({
        body: Buffer.from(data.body.data),
        sig: data.signature,
      });

      switch (event.type) {
        case 'account.updated':
          const accountData = event.data.object as Stripe.Account;

          if (accountData.payouts_enabled || accountData.details_submitted) {
            const frontendUrl = await this.configService.get('frontendUrl');

            const user = await this.coreService.findUser({
              stripeAccountId: accountData.id,
            });

            if (!user.isStripeEnabled && user.id && accountData.id) {
              await this.coreService.updateUser({
                query: { stripeAccountId: accountData.id },
                data: { isStripeEnabled: true },
              });

              this.notificationsService.sendEmail({
                template: {
                  key: emailTemplates.stripeLinked,
                  data: [
                    {
                      name: 'BACKURL',
                      content: `${frontendUrl}/dashboard/profile`,
                    },
                  ],
                },
                to: [{ email: user.email, name: user.fullName }],
              });
            }
          }
          break;
        default:
          console.log(`Unhandled event type ${event.type}.`);
      }
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: CREATE_TEMPLATE_STRIPE_PRODUCT })
  async createTemplateStripeProduct(
    @Payload()
    data: {
      name: string;
      priceInCents: number;
      description: string;
      images: string[];
    },
  ) {
    return this.paymentService.createProduct({ type: 'template', ...data });
  }

  @MessagePattern({ cmd: GET_TEMPLATE_STRIPE_PRODUCT })
  async getTemplateStripeProduct(@Payload() data: { productId: string }) {
    return this.paymentService.getProduct(data.productId);
  }

  @MessagePattern({ cmd: GET_STRIPE_PRODUCT_CHECKOUT_SESSION })
  async getProductCheckoutSession(
    @Payload()
    data: {
      productId: string;
      customerEmail: string;
      customer: string;
    },
  ) {
    const product = await this.paymentService.getProduct(data.productId);

    if (product?.id) {
      return this.paymentService.getStripeCheckoutSession({
        paymentMode: 'payment',
        priceId: product.default_price as string,
        basePath: 'dashboard',
        customerEmail: data.customerEmail,
        customer: data.customer,
      });
    }

    return {};
  }

  async handleFirstSubscription(invoice: Stripe.Invoice) {
    const subscription = await this.paymentService.getSubscription(
      invoice.subscription,
    );

    const frontendUrl = await this.configService.get('frontendUrl');

    const user = await this.coreService.findUser({
      stripeSubscriptionId: subscription.id,
    });

    await this.coreService.updateUser({
      query: { stripeSubscriptionId: subscription.id },
      data: {
        isSubscriptionActive: subscription.status === 'active',
        renewSubscriptionTimestampInSeconds: subscription.current_period_end,
      },
    });

    if (
      Boolean(user.isSubscriptionActive) === false &&
      subscription.status === 'active'
    ) {
      this.notificationsService.sendEmail({
        template: {
          key: emailTemplates.subscriptionSuccessful,
          data: [
            {
              name: 'BACKURL',
              content: `${frontendUrl}/dashboard/profile`,
            },
            {
              name: 'USERNAME',
              content: user.fullName,
            },
          ],
        },
        to: [{ email: user.email, name: user.fullName }],
      });
    }
  }

  async handleSubscriptionUpdate(invoice: Stripe.Invoice) {
    const subscription = await this.paymentService.getSubscription(
      invoice.subscription,
    );

    const productData = await this.paymentService.getStripeProduct(
      // @ts-ignore
      subscription.plan.product,
    );

    const currentPlan = plans[productData.name || 'House'];

    await this.coreService.updateUser({
      query: { stripeSubscriptionId: invoice.subscription },
      data: {
        subscriptionPlanKey: productData.name,
        maxTemplatesNumber: currentPlan.features.templatesLimit,
        maxMeetingTime: currentPlan.features.timeLimit,
        renewSubscriptionTimestampInSeconds: subscription.current_period_end,
      },
    });
  }

  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const environment = await this.configService.get('environment');

    const planData = plans['House'];

    await this.coreService.updateUser({
      query: { stripeSubscriptionId: subscription.id },
      data: {
        isSubscriptionActive: false,
        stripeSubscriptionId: null,
        subscriptionPlanKey: 'House',
        maxTemplatesNumber: planData.features.templatesLimit,
        maxMeetingTime: planData.features.timeLimit,
        renewSubscriptionTimestampInSeconds:
          (environment === 'demo'
            ? addMonthsCustom(Date.now(), 1)
            : addDaysCustom(Date.now(), 1)
          ).getTime() / 1000,
      },
    });
  }

  async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    await this.coreService.updateUser({
      query: { stripeSubscriptionId: subscription.id },
      data: { isSubscriptionActive: false },
    });
  }

  async createSubscriptionsIfNotExists() {
    const subscriptions = await this.paymentService.getStripeSubscriptions();

    if (!subscriptions?.length) {
      const plansPromises = Object.values(plans).map(
        (planData) => async () =>
          this.paymentService.createProduct({
            name: planData.name,
            priceInCents: planData.priceInCents,
            description: planData.description,
            type: 'subscription',
          }),
      );

      await executePromiseQueue(plansPromises);
    }
  }

  async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    if (!session.subscription) {
      const checkout = await this.paymentService.getCheckoutSession(session.id);

      const item = checkout.line_items.data[0];

      const productId = item.price.product;

      await this.coreService.addTemplateToUser({
        productId: productId as string,
        customerId: checkout.customer as string,
      });

      return;
    }

    const subscription = await this.paymentService.getSubscription(
      session.subscription,
    );

    const product = await this.paymentService.getStripeProduct(
      // @ts-ignore
      subscription.plan.product,
    );

    const plan = plans[product.name || 'House'];

    await this.coreService.updateUser({
      query: { stripeSessionId: session.id },
      data: {
        stripeSubscriptionId: session.subscription as string,
        subscriptionPlanKey: product.name,
        maxTemplatesNumber: plan.features.templatesLimit,
        maxMeetingTime: plan.features.timeLimit,
      },
    });
  }
}
