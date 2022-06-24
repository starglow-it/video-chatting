import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';

import { PAYMENTS_SCOPE } from '@shared/const/api-scopes.const';
import { ResponseSumType } from '@shared/response/common.response';

import { PaymentsService } from './payments.service';
import { CoreService } from '../core/core.service';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { TemplatesService } from '../templates/templates.service';

@Controller(PAYMENTS_SCOPE)
export class PaymentsController {
  private readonly logger = new Logger();

  constructor(
    private paymentsService: PaymentsService,
    private coreService: CoreService,
    private templateService: TemplatesService,
  ) {}

  @UseGuards(JwtAuthGuard)
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

      if (!user.stripeAccountId) {
        const { accountId, accountLink, accountEmail } =
          await this.paymentsService.createStripeExpressAccount({
            accountId: user.stripeAccountId,
            email: user.contactEmail,
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
          message: `An error occurs, while connect stripe account`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
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
          message: `An error occurs, while connect stripe account`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
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
          data: { stripeAccountId: '' },
        });
      }

      return;
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

  @UseGuards(JwtAuthGuard)
  @Post('/createPayment')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Payment Intent' })
  @ApiOkResponse({
    description: 'Create Payment Intent',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async createPaymentIntent(
    @Body() body: { templateId: string },
    @Request() req,
  ): Promise<
    ResponseSumType<{ paymentIntent: { id: string; clientSecret: string } }>
  > {
    try {
      const userTemplate = await this.templateService.getUserTemplate({
        id: body.templateId,
      });

      const user = await this.coreService.findUserById({
        userId: userTemplate.user.id,
      });

      const paymentIntent = await this.paymentsService.createPaymentIntent({
        templatePrice: userTemplate.templatePrice,
        templateCurrency: userTemplate.templateCurrency?.toLowerCase(),
        stripeAccountId: user.stripeAccountId,
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
          message: `An error occurs, while connect stripe account`,
        },
        JSON.stringify(err),
      );

      throw new BadRequestException(err);
    }
  }

  @UseGuards(JwtAuthGuard)
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

      await this.coreService.deleteMeetingDonation({
        paymentIntentId: data.paymentIntentId,
      });

      return {
        success: true,
        result: {},
      };
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

  @Post('/webhook')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Catch Webbhook Requests' })
  @ApiOkResponse({
    description: 'Catch Webbhook Requests',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
  })
  async webhookHandler(
    @Body() body: any,
    @Request() req,
    @Response() res,
  ): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'];

      await this.paymentsService.handleWebhook({
        signature,
        body: body,
      });

      // Return a 200 response to acknowledge receipt of the event
      res.send();
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
}
