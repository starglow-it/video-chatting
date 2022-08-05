import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Stripe } from 'stripe';

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
import { PAYMENTS_SERVICE } from '@shared/const/services.const';
import { PAYMENTS_SCOPE } from '@shared/const/api-scopes.const';
import { ConfigClientService } from '../config/config.service';
import { PaymentsService } from './payments.service';
import { CoreService } from '../core/core.service';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';
import { NotificationsService } from '../notifications/notifications.service';
import { emailTemplates } from '@shared/const/email-templates.const';
import { plans } from '@shared/const/subscriptions.const';

@Controller(PAYMENTS_SCOPE)
export class PaymentsController {
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
      const subscription = await this.paymentService.getSubscription(
        data.stripeSubscriptionId,
      );

      const product = await this.paymentService.getStripeProduct(
        subscription.items[0].plan.product,
      );

      const plan = plans[product.name || "House" ];

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
            // @ts-ignore
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
    @Payload() data: { productId: string; meetingToken: string; baseUrl: string },
  ) {
    try {
      const product = await this.paymentService.getStripeProduct(
        data.productId,
      );

      return this.paymentService.getStripeCheckoutSession(
          // @ts-ignore
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

      let subscription: Stripe.Subscription | undefined;

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

          const plan = plans[product.name];

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
          console.log(subscription);
          console.log(`Subscription status is ${subscription.status}.`);
          break;
        case 'customer.subscription.created':
          subscription = event.data.object as Stripe.Subscription;

          await this.coreService.updateUser({
            query: { stripeSubscriptionId: subscription.id },
            data: { isSubscriptionActive: false },
          });
          break;
        case 'customer.subscription.updated':
          subscription = event.data.object as Stripe.Subscription;

          const frontendUrl = await this.configService.get('frontendUrl');

          const user = await this.coreService.findUser({
            query: { stripeSubscriptionId: subscription.id },
          });

          await this.coreService.updateUser({
            query: { stripeSubscriptionId: subscription.id },
            data: {
              isSubscriptionActive: subscription.status === 'active',
            },
          });

          if (!user.isSubscriptionActive && subscription.status === 'active') {
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
  async handleExpressWebhook(@Payload() data: { body: any; signature: string }) {
    try {
      const event = await this.paymentService.createWebhookEvent({
        body: Buffer.from(data.body.data),
        sig: data.signature,
      });

      switch (event.type) {
        case 'account.updated':
          const accountData = event.data.object as Stripe.Account;

          if (accountData.payouts_enabled || accountData.details_submitted) {
            const frontendUrl = await this.configService.get('frontendUrl');

            const user = await this.coreService.findUser({
              query: {
                stripeAccountId: accountData.id,
              },
            });

            if (!user.isStripeEnabled) {
                await this.coreService.updateUser({
                    query: { stripeAccountId: accountData.id },
                    data: { isStripeEnabled: true },
                });

                this.notificationsService.sendEmail({
                    template: {
                        key: emailTemplates.stripeLinked,
                        data: [
                            {
                                name: "BACKURL", content: `${frontendUrl}/dashboard/profile`
                            }
                        ]
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
