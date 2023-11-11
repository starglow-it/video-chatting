import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Stripe } from 'stripe';

// patterns
import { PaymentsBrokerPatterns, PlanData } from 'shared-const';

// services
import { ConfigClientService } from '../../services/config/config.service';
import { PaymentsService } from './payments.service';
import { CoreService } from '../../services/core/core.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { SocketService } from '../../services/socket/socket.service';

// const
import {
  PAYMENTS_SCOPE,
  PAYMENTS_SERVICE,
  plans,
  emailTemplates,
} from 'shared-const';

// utils
import { addMonthsCustom } from '../../utils/dates/addMonths';
import { addDaysCustom } from '../../utils/dates/addDaysCustom';
import { executePromiseQueue } from '../../utils/executePromiseQueue';

// payloads
import {
  CancelPaymentIntentPayload,
  CancelUserSubscriptionPayload,
  CreatePaymentIntentPayload,
  CreateStripeAccountLinkPayload,
  CreateStripeExpressAccountPayload,
  CreateStripeTemplateProductPayload,
  DeleteStripeExpressAccountPayload,
  GetProductCheckoutSessionPayload,
  GetStripeChargesPayload,
  GetStripeCheckoutSessionPayload,
  GetStripePortalSessionPayload,
  GetStripeSubscriptionPayload,
  GetStripeTemplateProductByNamePayload,
  GetStripeTemplateProductPayload,
  ICommonUser,
  LoginStripeExpressAccountPayload,
  MonetizationStatisticPeriods,
  MonetizationStatisticTypes,
  PlanKeys,
  UpdateStripeTemplateProductPayload,
} from 'shared-types';
import { DeleteTemplateStripeProductPayload } from 'shared-types/src/brokerPayloads';

@Controller(PAYMENTS_SCOPE)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private configService: ConfigClientService,
    private notificationsService: NotificationsService,
    private paymentService: PaymentsService,
    private coreService: CoreService,
    private socketService: SocketService,
  ) {}

  @Post('/webhook')
  async webhookHandler(
    @Body() body: any,
    @Request() req,
    @Response() res,
  ): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'];

      const event = await this.paymentService.createWebhookEvent({
        body,
        sig: signature,
      });

      switch (event.type) {
        case 'checkout.session.completed':
          this.logger.log('handle "checkout.session.completed" event');

          await this.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;
        case 'customer.subscription.deleted':
          this.logger.log('handle "customer.subscription.deleted" event');
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;
        case 'customer.subscription.created':
          this.logger.log('handle "customer.subscription.created" event');
          await this.handleSubscriptionCreated(
            event.data.object as Stripe.Subscription,
          );
          break;
        case 'customer.subscription.updated':
          this.logger.log('handle "customer.subscription.updated" event');
          await this.handleSubscriptionUpdate(
            event.data.object as Stripe.Subscription,
          );
          break;
        case 'invoice.paid':
          this.logger.log('handle "invoice.paid" event');
          await this.handleFirstSubscription(
            event.data.object as Stripe.Invoice,
          );
          break;
        // case 'payment_intent.succeeded':
        //   this.logger.log('handle "payment_intent.succeeded" event');
        //   await this.handleRoomsTransactions(
        //     event.data.object as Stripe.PaymentIntent,
        //   );
        //   break;
        case 'charge.succeeded':
          this.logger.log('handle "charge.succeeded" event');
          await this.handleChargeSuccess(event.data.object as Stripe.Charge);
          break;
        case 'customer.subscription.trial_will_end':
          this.logger.log(
            'handle "customer.subscription.trial_will_end" event',
          );
          await this.handleTrialWillEnd(
            event.data.object as Stripe.Subscription,
          );
          break;
        default:
          console.log(`Unhandled event type ${event.type}.`);
      }

      // Return a 200 response to acknowledge receipt of the event
      res.send();
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while stripe webhooks event`,
        },
        JSON.stringify(err.message),
      );

      throw new BadRequestException(err.message);
    }
  }

  @Post('/express-webhook')
  async expressWebhookHandler(
    @Body() body: any,
    @Request() req,
    @Response() res,
  ): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'];

      const event = await this.paymentService.createExpressWebhookEvent({
        body,
        sig: signature,
      });

      switch (event.type) {
        case 'account.updated':
          this.logger.log('handle "account.updated" on express webhook event');
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

      // Return a 200 response to acknowledge receipt of the event
      res.send();
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while stripe express webhook event`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @MessagePattern({ cmd: PaymentsBrokerPatterns.CreateStripeExpressAccount })
  async createStripeExpressAccount(
    @Payload() payload: CreateStripeExpressAccountPayload,
  ) {
    try {
      this.logger.log({
        message: `createStripeExpressAccount input payload`,
        ctx: payload,
      });

      if (!payload.accountId) {
        const account = await this.paymentService.createExpressAccount({
          email: payload.email,
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

  @MessagePattern({ cmd: PaymentsBrokerPatterns.CreateStripeAccountLink })
  async createStripeAccountLink(
    @Payload() payload: CreateStripeAccountLinkPayload,
  ) {
    this.logger.log({
      message: `createStripeAccountLink input payload`,
      ctx: payload,
    });

    const accountLink = await this.paymentService.createExpressAccountLink({
      accountId: payload.accountId,
    });

    return {
      accountLink: accountLink.url,
    };
  }

  @MessagePattern({ cmd: PaymentsBrokerPatterns.LoginStripeExpressAccount })
  async loginStripeExpressAccount(
    @Payload() payload: LoginStripeExpressAccountPayload,
  ) {
    try {
      this.logger.log({
        message: `loginStripeExpressAccount input payload`,
        ctx: payload,
      });

      const existedAccount = await this.paymentService.getExpressAccount({
        accountId: payload.accountId,
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

  @MessagePattern({ cmd: PaymentsBrokerPatterns.DeleteStripeExpressAccount })
  async deleteStripeExpressAccount(
    @Payload() payload: DeleteStripeExpressAccountPayload,
  ) {
    try {
      this.logger.log({
        message: `deleteStripeExpressAccount input payload`,
        ctx: payload,
      });

      await this.paymentService.deleteExpressAccount({
        accountId: payload.accountId,
      });

      return;
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: PaymentsBrokerPatterns.CreatePaymentIntent })
  async createPaymentIntent(
    @Payload()
    payload: CreatePaymentIntentPayload,
  ) {
    try {
      this.logger.log({
        message: `createPaymentIntent input payload`,
        ctx: payload,
      });

      let product: Stripe.Response<Stripe.Product> = null;

      if (payload.stripeSubscriptionId) {
        const subscription = await this.paymentService.getSubscription(
          payload.stripeSubscriptionId,
        );

        product = await this.paymentService.getStripeProduct(
          subscription?.['plan']?.product,
        );
      }

      const plan = plans[product?.name || PlanKeys.House] as PlanData;

      const paymentIntent = await this.paymentService.createPaymentIntent({
        templatePrice: payload.templatePrice,
        templateCurrency: payload.templateCurrency,
        stripeAccountId: payload.stripeAccountId,
        platformFee: plan.features.comissionFee[payload.meetingRole],
        templateId: payload.templateId,
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

  @MessagePattern({ cmd: PaymentsBrokerPatterns.CancelPaymentIntent })
  async cancelPaymentIntent(@Payload() payload: CancelPaymentIntentPayload) {
    try {
      this.logger.log({
        message: `cancelPaymentIntent input payload`,
        ctx: payload,
      });

      const paymentIntent = await this.paymentService.getPaymentIntent({
        paymentIntentId: payload.paymentIntentId,
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
          paymentIntentId: payload.paymentIntentId,
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

  @MessagePattern({ cmd: PaymentsBrokerPatterns.GetStripeTemplateProducts })
  async getStripeTemplatesProducts() {
    try {
      const products = await this.paymentService.getStripeProducts();

      const pricesPromise = products.data.map(async (product) => {
        const price = await this.paymentService.getProductPrice(product.id);

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

  @MessagePattern({ cmd: PaymentsBrokerPatterns.GetStripeSubscriptionProducts })
  async getStripeSubscriptionsProducts() {
    try {
      const subscriptionProducts =
        await this.paymentService.getStripeSubscriptions();

      const pricesPromise = subscriptionProducts.map(async (product) => {
        const price = await this.paymentService.getProductPrice(product.id);

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

  @MessagePattern({ cmd: PaymentsBrokerPatterns.GetStripeCheckoutSession })
  async getStripeCheckoutSession(
    @Payload()
    payload: GetStripeCheckoutSessionPayload,
  ) {
    try {
      this.logger.log({
        message: `getStripeCheckoutSession input payload`,
        ctx: payload,
      });

      const environment = await this.configService.get('environment');

      const product = await this.paymentService.getStripeProduct(
        payload.productId,
      );

      const price = await this.paymentService.getProductPrice(product.id);

      const plan = plans[product.name ?? PlanKeys.House];

      const user = await this.coreService.findUser({
        email: payload.customerEmail,
      });

      let customer: Stripe.Customer;

      if (!user.stripeCustomerId) {
        customer = await this.paymentService.createCustomer(user);
      }

      customer = (await this.paymentService.getCustomer({
        customerId: user.stripeCustomerId,
      })) as Stripe.Customer;

      const session = await this.paymentService.getStripeCheckoutSession({
        paymentMode: 'subscription',
        priceId: price.id as string,
        basePath: payload.baseUrl,
        cancelPath: payload.cancelUrl,
        meetingToken: payload.meetingToken,
        customerEmail: user.email,
        customer: customer.id,
        trialPeriodEndTimestamp: payload.withTrial
          ? ['production'].includes(environment)
            ? plan.trialPeriodDays
            : plan.testTrialPeriodDays
          : undefined,
      });

      await this.coreService.findUserAndUpdate({
        userId: user.id,
        data: {
          stripeSessionId: session.id,
          stripeCustomerId: customer.id,
        },
      });
      return session;
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: PaymentsBrokerPatterns.GetStripePortalSession })
  async getStripePortalSession(
    @Payload() payload: GetStripePortalSessionPayload,
  ) {
    try {
      this.logger.log({
        message: `getStripePortalSession input payload`,
        ctx: payload,
      });

      const frontendUrl = await this.configService.get('frontendUrl');

      const subscription = await this.paymentService.getSubscription(
        payload.subscriptionId,
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

  @MessagePattern({ cmd: PaymentsBrokerPatterns.GetStripeSubscription })
  async getStripeSubscription(
    @Payload() payload: GetStripeSubscriptionPayload,
  ) {
    try {
      this.logger.log({
        message: `getStripePortalSession input payload`,
        ctx: payload,
      });

      return await this.paymentService.getSubscription(payload.subscriptionId);
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: PaymentsBrokerPatterns.CreateStripeTemplateProduct })
  async createTemplateStripeProduct(
    @Payload()
    payload: CreateStripeTemplateProductPayload,
  ) {
    try {
      return this.paymentService.createProduct({
        type: 'template',
        ...payload,
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: PaymentsBrokerPatterns.GetStripeTemplateProduct })
  async getTemplateStripeProduct(
    @Payload() payload: GetStripeTemplateProductPayload,
  ) {
    try {
      return this.paymentService.getProduct(payload.productId);
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({
    cmd: PaymentsBrokerPatterns.GetStripeTemplateProductByName,
  })
  async getTemplateStripeProductByName(
    @Payload() payload: GetStripeTemplateProductByNamePayload,
  ) {
    const templatesList = await this.paymentService.getStripeTemplates();

    return templatesList.filter(
      (template) => template.name === payload.name,
    )[0];
  }

  @MessagePattern({
    cmd: PaymentsBrokerPatterns.UpdateStripeTemplateProduct,
  })
  async updateStripeTemplateProduct(
    @Payload() payload: UpdateStripeTemplateProductPayload,
  ) {
    return this.paymentService.updateProduct(payload.productId, payload.data);
  }

  @MessagePattern({
    cmd: PaymentsBrokerPatterns.DeleteTemplateStripeProduct,
  })
  async deleteTemplateStripeProduct(
    @Payload() payload: DeleteTemplateStripeProductPayload,
  ) {
    return this.paymentService.deleteStripeProduct(payload);
  }

  @MessagePattern({
    cmd: PaymentsBrokerPatterns.CancelUserSubscription,
  })
  async cancelUserSubscription(
    @Payload() payload: CancelUserSubscriptionPayload,
  ) {
    return this.paymentService.cancelStripeSubscription(payload);
  }

  @MessagePattern({
    cmd: PaymentsBrokerPatterns.GetStripeProductCheckoutSession,
  })
  async getProductCheckoutSession(
    @Payload()
    payload: GetProductCheckoutSessionPayload,
  ) {
    try {
      const product = await this.paymentService.getProduct(payload.productId);

      const price = await this.paymentService.getProductPrice(product.id);

      console.log(price.id);

      if (product?.id) {
        return this.paymentService.getStripeCheckoutSession({
          paymentMode: 'payment',
          priceId: price.id,
          basePath: 'dashboard',
          customerEmail: payload.customerEmail,
          customer: payload.customer,
          userId: payload.userId,
          templateId: payload.templateId,
        });
      }

      return {};
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
  }

  @MessagePattern({
    cmd: PaymentsBrokerPatterns.GetStripeCharges,
  })
  async getStripeCharges(
    @Payload()
    payload: GetStripeChargesPayload,
  ) {
    try {
      if (payload.type === 'subscription') {
        return this.paymentService.getSubscriptionCharges(payload);
      }

      if (payload.type === 'transactions') {
        return this.paymentService.getTransactionsCharges(payload);
      }

      if (payload.type === 'roomsPurchase') {
        return this.paymentService.getRoomsPurchaseCharges(payload);
      }

      return this.paymentService.getCharges(payload);
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: PAYMENTS_SERVICE,
      });
    }
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
        isSubscriptionActive: ['active', 'trialing'].includes(
          subscription.status,
        ),
        renewSubscriptionTimestampInSeconds: subscription.current_period_end,
      },
    });

    if (
      Boolean(user.isSubscriptionActive) === false &&
      ['active', 'trialing'].includes(subscription.status)
    ) {
      console.log('send email');

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

  async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const user = await this.coreService.findUser({
      stripeCustomerId: subscription.customer as string,
    });

    const updateData: Partial<ICommonUser> = {};

    if (!user.stripeSubscriptionId) {
      Object.assign(updateData, {
        stripeSubscriptionId: subscription.id,
      });
    }

    const productData = await this.paymentService.getStripeProduct(
      subscription['plan'].product,
    );

    const currentPlan = plans[user.subscriptionPlanKey || PlanKeys.House];
    const nextPlan = plans[productData.name || PlanKeys.House];

    const isPlanHasChanged = nextPlan.name !== currentPlan.name;
    const isPlanDowngraded = currentPlan.priceInCents > nextPlan.priceInCents;
    const isCurrentSubscriptionIsActive =
      user.renewSubscriptionTimestampInSeconds * 1000 > Date.now();

    const isSubscriptionPeriodUpdated =
      user.renewSubscriptionTimestampInSeconds <
      subscription.current_period_end;

    Object.assign(updateData, {
      subscriptionPlanKey: isSubscriptionPeriodUpdated
        ? nextPlan.name
        : currentPlan.name,
      nextSubscriptionPlanKey: !isSubscriptionPeriodUpdated
        ? nextPlan.name
        : null,
      prevSubscriptionPlanKey: user.subscriptionPlanKey,
      maxTemplatesNumber: isSubscriptionPeriodUpdated
        ? nextPlan.features.templatesLimit
        : currentPlan.features.templatesLimit,
      maxMeetingTime: isSubscriptionPeriodUpdated
        ? nextPlan.features.timeLimit
        : currentPlan.features.timeLimit,
      renewSubscriptionTimestampInSeconds: isCurrentSubscriptionIsActive
        ? user.renewSubscriptionTimestampInSeconds
        : subscription.current_period_end,
      isDowngradeMessageShown: !(
        isPlanHasChanged &&
        isPlanDowngraded &&
        (isCurrentSubscriptionIsActive || isSubscriptionPeriodUpdated)
      ),
    });

    await this.coreService.updateUser({
      query: { stripeSubscriptionId: subscription.id },
      data: updateData,
    });

    if (isSubscriptionPeriodUpdated) {
      await this.coreService.deleteLeastUsedUserTemplates({
        userId: user.id,
        templatesLimit: nextPlan.features.templatesLimit,
      });
    }
  }

  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const environment = await this.configService.get('environment');

    const planData = plans[PlanKeys.House];

    const trialExpired =
      subscription.trial_end === subscription.current_period_end;

    const user = await this.coreService.findUser({
      stripeSubscriptionId: subscription.id,
    });

    await this.coreService.updateUser({
      query: { stripeSubscriptionId: subscription.id },
      data: {
        isSubscriptionActive: false,
        stripeSubscriptionId: null,
        subscriptionPlanKey: PlanKeys.House,
        maxTemplatesNumber: planData.features.templatesLimit,
        maxMeetingTime: planData.features.timeLimit,
        shouldShowTrialExpiredNotification: trialExpired,
        renewSubscriptionTimestampInSeconds:
          (['production', 'demo'].includes(environment)
            ? addMonthsCustom(Date.now(), 1)
            : addDaysCustom(Date.now(), 1)
          ).getTime() / 1000,
      },
    });

    if (trialExpired) {
      await this.socketService.sendTrialExpiredNotification({
        userId: user.id,
      });
    }

    await this.coreService.deleteLeastUsedUserTemplates({
      userId: user.id,
      templatesLimit: planData.features.templatesLimit,
    });
  }

  async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    await this.coreService.updateUser({
      query: { stripeCustomerId: subscription.customer },
      data: {
        isSubscriptionActive: false,
        stripeSubscriptionId: subscription.id,
      },
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
    if (session.subscription) {
      const subscription = await this.paymentService.getSubscription(
        session.subscription,
      );

      const product = await this.paymentService.getStripeProduct(
        subscription['plan'].product,
      );

      const plan = plans[product.name || PlanKeys.House];

      await this.coreService.updateUser({
        query: { stripeSessionId: session.id },
        data: {
          stripeSubscriptionId: session.subscription as string,
          subscriptionPlanKey: plan.name,
          maxTemplatesNumber: plan.features.templatesLimit,
          maxMeetingTime: plan.features.timeLimit,
          isProfessionalTrialAvailable: false,
        },
      });

      if (
        subscription.status === 'trialing' &&
        !subscription.cancel_at_period_end
      ) {
        await this.paymentService.updateSubscription({
          subscriptionId: subscription.id,
          options: { cancelAtPeriodEnd: true },
        });
      }

      await this.coreService.updateMonetizationStatistic({
        period: MonetizationStatisticPeriods.AllTime,
        type: MonetizationStatisticTypes.Subscriptions,
        value: session.amount_total,
      });
    }
  }

  async handleChargeSuccess(charge: Stripe.Charge) {
    const isTransactionCharge = Boolean(
      parseInt(charge.metadata.isTransactionCharge, 10),
    );

    const isTemplateCharge =
      charge?.metadata?.templateId &&
      Boolean(parseInt(charge.metadata.isRoomPurchase, 10));

    if (isTemplateCharge) {
      await this.coreService.addTemplateToUser({
        templateId: charge.metadata.templateId,
        userId: charge.metadata.userId,
      });

      await this.coreService.updateMonetizationStatistic({
        period: MonetizationStatisticPeriods.AllTime,
        type: MonetizationStatisticTypes.PurchaseRooms,
        value: charge.amount,
      });
    } else if (isTransactionCharge) {
      const userTemplate = await this.coreService.getUserTemplateById({
        id: charge.metadata.templateId,
      });

      const commonTemplate = await this.coreService.getCommonTemplate({
        templateId: userTemplate.templateId,
      });

      await this.coreService.updateRoomRatingStatistic({
        templateId: commonTemplate.id,
        ratingKey: 'money',
        value: charge.amount,
      });

      await this.coreService.updateRoomRatingStatistic({
        templateId: commonTemplate.id,
        ratingKey: 'transactions',
        value: 1,
      });

      await this.coreService.updateMonetizationStatistic({
        period: MonetizationStatisticPeriods.AllTime,
        type: MonetizationStatisticTypes.RoomTransactions,
        value: charge.amount,
      });

      const transferUser = await this.coreService.findUser({
        stripeAccountId: charge.transfer_data?.destination as string,
      });

      await this.coreService.updateUserProfileStatistic({
        userId: transferUser.id,
        statisticKey: 'moneyEarned',
        value: charge.amount,
      });
    }
  }

  async handleTrialWillEnd(subscription: Stripe.Subscription) {
    const user = await this.coreService.findUser({
      stripeSubscriptionId: subscription.id,
    });
    const frontendUrl = await this.configService.get('frontendUrl');

    this.notificationsService.sendEmail({
      template: {
        key: emailTemplates.trialExpires,
        data: [
          {
            name: 'USERNAME',
            content: user.fullName,
          },
          {
            name: 'PROFILELINK',
            content: `${frontendUrl}/dashboard/profile#subscriptions`,
          },
        ],
      },
      to: [{ email: user.email, name: user.fullName }],
    });
  }
}
