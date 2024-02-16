import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { PAYMENTS_SCOPE } from 'shared-const';
import { ResponseSumType, UserRoles } from 'shared-types';

import { PaymentsService } from './payments.service';
import { CoreService } from '../../services/core/core.service';
import { TemplatesService } from '../templates/templates.service';
import { UserTemplatesService } from '../user-templates/user-templates.service';

import { JwtAuthAnonymousGuard } from '../../guards/jwt-anonymous.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CommonTemplateRestDTO } from '../../dtos/response/common-template.dto';
import { CreatePaymentRequest } from '../../dtos/requests/create-payment.request';
import { PaymentIntentRestDto } from '../../dtos/response/payment-intent.dto';

@ApiTags('Payments')
@Controller(PAYMENTS_SCOPE)
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private paymentsService: PaymentsService,
    private coreService: CoreService,
    private templateService: TemplatesService,
    private userTemplatesService: UserTemplatesService,
  ) { }

  @UseGuards(JwtAuthAnonymousGuard)
  @Post('/stripe')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe Account' })
  @ApiOkResponse({
    description: 'create payment link generated',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async connectAccount(
    @Request() req,
  ): Promise<ResponseSumType<{ url: string }>> {
    try {
      const user = await this.coreService.findUserById({
        userId: req.user.userId,
      });

      let email = user.email;
      if (user.role === UserRoles.Anonymous) {
        email = 'anonymous@gmail.com';
      }

      if (!user.stripeAccountId) {
        const { accountId, accountLink, accountEmail } =
          await this.paymentsService.createStripeExpressAccount({
            accountId: user.stripeAccountId,
            email: user.contactEmail || email,
          });

        await this.coreService.findUserAndUpdate({
          userId: req.user.userId,
          data: { stripeAccountId: accountId, stripeEmail: accountEmail },
        });

        return {
          success: true,
          result: {
            url: accountLink,
          },
        };
      } else {
        const { accountLink } = await this.paymentsService.createAccountLink({
          accountId: user.stripeAccountId,
        });

        return {
          success: true,
          result: {
            url: accountLink,
          },
        };
      }
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while connect stripe account`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthAnonymousGuard)
  @Get('/stripe')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Login Stripe Account' })
  @ApiOkResponse({
    description: 'login payment link generated',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async loginAccount(
    @Request() req,
  ): Promise<ResponseSumType<{ url: string }>> {
    try {
      const user = await this.coreService.findUserById({
        userId: req.user.userId,
      });

      if (user.stripeAccountId) {
        const { accountLink } =
          await this.paymentsService.loginStripeExpressAccount({
            accountId: user.stripeAccountId,
          });

        return {
          success: true,
          result: {
            url: accountLink,
          },
        };
      }

      return {
        success: true,
        result: {
          url: '',
        },
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get login url`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthAnonymousGuard)
  @Delete('/stripe')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Stripe Account' })
  @ApiOkResponse({
    description: 'delete stripe express account',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async deleteAccount(@Request() req) {
    try {
      const user = await this.coreService.findUserById({
        userId: req.user.userId,
      });

      if (user.stripeAccountId) {
        await this.paymentsService.deleteStripeExpressAccount({
          accountId: user.stripeAccountId,
        });

        await this.coreService.findUserAndUpdate({
          userId: req.user.userId,
          data: {
            stripeAccountId: '',
            isStripeEnabled: false,
            stripeEmail: '',
            wasSuccessNotificationShown: false,
          },
        });
      }

      return;
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while delete stripe account`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @Post('/createPayment')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Payment Intent' })
  @ApiOkResponse({
    type: PaymentIntentRestDto,
    description: 'Create Payment Intent',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async createPaymentIntent(
    @Body() body: CreatePaymentRequest,
  ): Promise<
    ResponseSumType<{ paymentIntent: { id: string; clientSecret: string } }>
  > {
    try {
      const userTemplate = await this.userTemplatesService.getUserTemplateById({
        id: body.templateId,
      });

      if (!userTemplate) {
        return {
          success: false,
        };
      }

      const templatePayment = await this.coreService.getEnabledTemplatePayment({
        userTemplateId: userTemplate.id,
        paymentType: body.paymentType,
        meetingRole: body.meetingRole,
      });

      const price = templatePayment.price;
      const currency = templatePayment.currency;

      const user = await this.coreService.findUserById({
        userId: userTemplate.user.id,
      });

      const paymentIntent = await this.paymentsService.createPaymentIntent({
        templatePrice: price,
        templateCurrency: currency?.toLowerCase(),
        stripeAccountId: user.stripeAccountId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        templateId: userTemplate.id,
        meetingRole: body.meetingRole,
      });
      console.log({
        templatePrice: price,
        templateCurrency: currency?.toLowerCase(),
        stripeAccountId: user.stripeAccountId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        templateId: userTemplate.id,
        meetingRole: body.meetingRole,
      });
      return {
        success: true,
        result: {
          paymentIntent,
        },
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while create payment intent`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @Post('/isRoomPaywalled')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Identify if the room is paywalled' })
  @ApiOkResponse({
    type: PaymentIntentRestDto,
    description: 'Identify if the room is paywalled',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async isRoomPaywalled(
    @Body() body: CreatePaymentRequest,
  ): Promise<
    ResponseSumType<{ isRoomPaywalled: boolean }>
  > {
    try {
      const userTemplate = await this.userTemplatesService.getUserTemplateById({
        id: body.templateId,
      });

      if (!userTemplate) {
        return {
          success: false,
        };
      }

      const templatePayment = await this.coreService.isTemplatePaymentEnabled({
        userTemplateId: userTemplate.id,
        paymentType: body.paymentType,
        meetingRole: body.meetingRole,
      });

      if (!!templatePayment) {
        return {
          success: true,
          result: {
            isRoomPaywalled: true
          },
        }
      } else {
        return {
          success: true,
          result: {
            isRoomPaywalled: false
          },
        };
      }

    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while create payment intent`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @Post('/cancelPayment')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel payment intent' })
  @ApiOkResponse({
    description: 'Cancel payment intent',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async cancelPaymentIntent(
    @Body() data: { paymentIntentId: string },
  ): Promise<ResponseSumType<any>> {
    try {
      await this.paymentsService.cancelPaymentIntent({
        paymentIntentId: data.paymentIntentId,
      });

      return {
        success: true,
        result: {},
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while cancel payment intent`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthAnonymousGuard)
  @Get('/products')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Products' })
  @ApiOkResponse({
    description: 'Get Products',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getStripeProducts(): Promise<ResponseSumType<any>> {
    try {
      const products = await this.paymentsService.getStripeProducts();

      return {
        success: true,
        result: products,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get stripe products`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthAnonymousGuard)
  @Post('/products/:productId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buy Products' })
  @ApiOkResponse({
    description: 'Buy Product',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async buyProduct(
    @Request() req,
    @Body()
    body: {
      baseUrl: string;
      meetingToken: string;
      withTrial?: boolean;
      cancelUrl?: string;
    },
    @Param('productId') productId: string,
  ): Promise<ResponseSumType<any>> {
    try {
      const session = await this.paymentsService.getCheckoutSession({
        productId,
        meetingToken: body.meetingToken,
        baseUrl: body.baseUrl,
        withTrial: body.withTrial,
        customerEmail: req.user.email,
        cancelUrl: body.cancelUrl,
      });

      return {
        success: true,
        result: {
          url: session.url,
        },
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while buy stripe product`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthAnonymousGuard)
  @Get('/portal/:subscriptionId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Portal Session Url' })
  @ApiOkResponse({
    description: 'Get Portal Session Url',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getPortalSession(
    @Param('subscriptionId') subscriptionId: string,
  ): Promise<ResponseSumType<any>> {
    try {
      const portalSession = await this.paymentsService.getPortalSession({
        subscriptionId,
      });

      return {
        success: true,
        result: {
          url: portalSession.url,
        },
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get portal session url`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthAnonymousGuard)
  @Get('/subscriptions/:subscriptionId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Subscription' })
  @ApiOkResponse({
    description: 'Get Subscription',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async getStripeSubscription(
    @Param('subscriptionId') subscriptionId: string,
  ): Promise<ResponseSumType<any>> {
    try {
      const subscription = await this.paymentsService.getStripeSubscription({
        subscriptionId,
      });

      return {
        success: true,
        result: subscription,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while get stripe subscription url`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthAnonymousGuard)
  @Get('/templates/:templateId')
  @ApiOperation({ summary: 'Purchase Template' })
  @ApiOkResponse({
    type: CommonTemplateRestDTO,
    description: 'Purchase Common Template Success',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async purchaseCommonTemplate(
    @Request() req,
    @Param('templateId') templateId: string,
  ) {
    try {
      if (templateId) {
        const template = await this.templateService.getCommonTemplateById({
          templateId,
        });

        const user = await this.coreService.findUserById({
          userId: req.user.userId,
        });

        const productCheckoutSession =
          await this.paymentsService.getProductCheckoutSession({
            productId: template.stripeProductId,
            customerEmail: user.email,
            userId: user.id,
            customer: user.stripeCustomerId,
            templateId: template.id,
          });

        await this.coreService.findUserAndUpdate({
          userId: req.user.userId,
          data: {
            stripeSessionId: productCheckoutSession.id,
          },
        });

        return {
          success: true,
          result: productCheckoutSession.url,
        };
      }
      return {
        success: false,
        result: null,
      };
    } catch (err) {
      this.logger.error(
        {
          message: `An error occurs, while purchase common template`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }
}
