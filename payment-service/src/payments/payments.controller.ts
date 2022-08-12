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
  GET_STRIPE_PRODUCTS,
  GET_STRIPE_CHECKOUT_SESSION,
  GET_STRIPE_PORTAL_SESSION,
  GET_STRIPE_SUBSCRIPTION,
  HANDLE_EXPRESS_WEBHOOK,
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
import { addMonthsCustom } from '../utils/dates/addMonths';
import { addDaysCustom } from '../utils/dates/addDaysCustom';

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

  @MessagePattern({ cmd: GET_STRIPE_PRODUCTS })
  async getStripeProducts() {
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

  @MessagePattern({ cmd: GET_STRIPE_CHECKOUT_SESSION })
  async getStripeCheckoutSession(
    @Payload()
    data: {
      productId: string;
      meetingToken: string;
      baseUrl: string;
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

      return this.paymentService.getStripeCheckoutSession(
        product.default_price,
        data.baseUrl,
        data.meetingToken,
      );
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
      const environment = await this.configService.get('environment');

      const event = await this.paymentService.createWebhookEvent({
        body: Buffer.from(data.body.data),
        sig: data.signature,
      });

      let subscription: Stripe.Subscription | undefined;
      let invoice: Stripe.Invoice | undefined;

      switch (event.type) {
        case 'checkout.session.completed':
          const sessionData = event.data.object as Stripe.Checkout.Session;

          subscription = await this.paymentService.getSubscription(
            sessionData.subscription,
          );

          const product = await this.paymentService.getStripeProduct(
            // @ts-ignore
            subscription.plan.product,
          );

          const plan = plans[product.name || 'House'];

          await this.coreService.updateUser({
            query: { stripeSessionId: sessionData.id },
            data: {
              stripeSubscriptionId: sessionData.subscription as string,
              subscriptionPlanKey: product.name,
              maxTemplatesNumber: plan.features.templatesLimit,
              maxMeetingTime: plan.features.timeLimit,
            },
          });
          break;
        case 'customer.subscription.deleted':
          subscription = event.data.object as Stripe.Subscription;

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

          break;
        case 'customer.subscription.created':
          subscription = event.data.object as Stripe.Subscription;

          await this.coreService.updateUser({
            query: { stripeSubscriptionId: subscription.id },
            data: { isSubscriptionActive: false },
          });

          break;
        case 'invoice.payment_succeeded':
          invoice = event.data.object as Stripe.Invoice;

          const subscriptionData = await this.paymentService.getSubscription(
            invoice.subscription,
          );

          const productData = await this.paymentService.getStripeProduct(
            // @ts-ignore
            subscriptionData.plan.product,
          );

          const planData = plans[productData.name || 'House'];

          await this.coreService.updateUser({
            query: { stripeSubscriptionId: invoice.subscription },
            data: {
              subscriptionPlanKey: productData.name,
              maxTemplatesNumber: planData.features.templatesLimit,
              maxMeetingTime: planData.features.timeLimit,
              renewSubscriptionTimestampInSeconds:
                subscriptionData.current_period_end,
            },
          });

          break;
        case 'invoice.paid':
          invoice = event.data.object as Stripe.Invoice;
          subscription = await this.paymentService.getSubscription(
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
              renewSubscriptionTimestampInSeconds:
                subscription.current_period_end,
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
}
