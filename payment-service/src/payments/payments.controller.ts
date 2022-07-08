import { Controller } from '@nestjs/common';
import {MessagePattern, Payload, RpcException} from "@nestjs/microservices";
import {Stripe } from "stripe";
import {InjectStripe} from "nestjs-stripe";

import {
    CANCEL_PAYMENT_INTENT,
    CREATE_PAYMENT_INTENT,
    CREATE_STRIPE_EXPRESS_ACCOUNT,
    DELETE_STRIPE_EXPRESS_ACCOUNT,
    LOGIN_STRIPE_EXPRESS_ACCOUNT,
    HANDLE_WEBHOOK, CREATE_STRIPE_ACCOUNT_LINK,
} from "@shared/patterns/payments";
import { PAYMENTS_SERVICE } from "@shared/const/services.const";
import { PAYMENTS_SCOPE } from "@shared/const/api-scopes.const";
import {ConfigClientService} from "../config/config.service";
import {PaymentsService} from "./payments.service";
import {CoreService} from "../core/core.service";
import {ICommonUserDTO} from "@shared/interfaces/common-user.interface";

@Controller(PAYMENTS_SCOPE)
export class PaymentsController {
    constructor(
        private configService: ConfigClientService,
        private paymentService: PaymentsService,
        private coreService: CoreService,
        @InjectStripe() private readonly stripeClient: Stripe
    ) {}

    @MessagePattern({ cmd: CREATE_STRIPE_EXPRESS_ACCOUNT })
    async createStripeExpressAccount(
        @Payload() data: { accountId: string; email: string },
    ) {
        try {
            if (!data.accountId) {
                const account = await this.paymentService.createExpressAccount({ email: data.email });

                const accountLink = await this.paymentService.createExpressAccountLink({
                    accountId: account.id
                });

                return {
                    accountId: account.id,
                    accountLink: accountLink.url,
                    accountEmail: account.email
                };
            }

            return {
                accountId: '',
                accountLink: '',
            };
        } catch(err) {
            throw new RpcException({
                message: err.message,
                ctx: PAYMENTS_SERVICE,
            });
        }
    }

    @MessagePattern({ cmd: CREATE_STRIPE_ACCOUNT_LINK })
    async createStripeAccountLink(
        @Payload() data: { accountId: string; },
    ) {
        const accountLink = await this.paymentService.createExpressAccountLink({
            accountId: data.accountId
        });

        return {
            accountLink: accountLink.url,
        };
    }

    @MessagePattern({ cmd: LOGIN_STRIPE_EXPRESS_ACCOUNT })
    async loginStripeExpressAccount(
        @Payload() data: { accountId: string; },
    ) {
        try {
            const existedAccount = await this.paymentService.getExpressAccount({ accountId: data.accountId });

            const loginLink = await this.paymentService.createExpressAccountLoginLink({ accountId: existedAccount.id });

            return {
                accountLink: loginLink.url,
            };
        } catch(err) {
            throw new RpcException({
                message: err.message,
                ctx: PAYMENTS_SERVICE,
            });
        }
    }

    @MessagePattern({ cmd: DELETE_STRIPE_EXPRESS_ACCOUNT })
    async deleteStripeExpressAccount(
        @Payload() data: { accountId: string },
    ) {
        try {
            await this.paymentService.deleteExpressAccount({ accountId: data.accountId });

            return;
        } catch(err) {
            throw new RpcException({
                message: err.message,
                ctx: PAYMENTS_SERVICE,
            });
        }
    }

    @MessagePattern({ cmd: CREATE_PAYMENT_INTENT })
    async createPaymentIntent(
        @Payload() data: { templatePrice: number; templateCurrency: string; stripeAccountId: ICommonUserDTO["stripeAccountId"] },
    ) {
        try {
            const paymentIntent = await this.paymentService.createPaymentIntent({
                templatePrice: data.templatePrice,
                templateCurrency: data.templateCurrency,
                stripeAccountId: data.stripeAccountId,
            });

            return  {
                id: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
            }
        } catch(err) {
            throw new RpcException({
                message: err.message,
                ctx: PAYMENTS_SERVICE,
            });
        }
    }

    @MessagePattern({ cmd: CANCEL_PAYMENT_INTENT })
    async cancelPaymentIntent(
        @Payload() data: { paymentIntentId: string },
    ) {
        try {
            const paymentIntent = await this.paymentService.getPaymentIntent({ paymentIntentId: data.paymentIntentId });

            if (['requires_payment_method', 'requires_capture', 'requires_confirmation', 'requires_action', 'processing'].includes(paymentIntent.status)) {
                await this.paymentService.cancelPaymentIntent({ paymentIntentId: data.paymentIntentId });
            }

            return;
        } catch(err) {
            throw new RpcException({
                message: err.message,
                ctx: PAYMENTS_SERVICE,
            });
        }
    }

    @MessagePattern({ cmd: HANDLE_WEBHOOK })
    async handleWebhook(
        @Payload() data: { body: any, signature: string },
    ) {
        try {
            let event = await this.paymentService.createWebhookEvent({
                    body: Buffer.from(data.body.data),
                    sig: data.signature,
                });

            switch (event.type) {
                case "account.updated":
                    const accountData = event.data.object as Stripe.Account;

                    if (!accountData.payouts_enabled || !accountData.details_submitted) {
                        await this.coreService.updateUser({
                            query: { stripeAccountId: accountData.id },
                            data: { isStripeEnabled: true },
                        });
                    }

                    break;
                default:
                    console.log(`Unhandled event type ${event.type}.`);
            }
        } catch(err) {
            throw new RpcException({
                message: err.message,
                ctx: PAYMENTS_SERVICE,
            });
        }
    }
}
