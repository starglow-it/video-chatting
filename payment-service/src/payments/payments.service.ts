import { Injectable } from '@nestjs/common';
import {InjectStripe} from "nestjs-stripe";
import {Stripe} from "stripe";
import {ConfigClientService} from "../config/config.service";
import {ICommonUserDTO} from "@shared/interfaces/common-user.interface";

@Injectable()
export class PaymentsService {
    constructor(
        private configService: ConfigClientService,
        @InjectStripe() private readonly stripeClient: Stripe,
    ) {}

    async createExpressAccount({ email }: { email: string }) {
        return this.stripeClient.accounts.create({
            type: "express",
            email,
            capabilities: {
                transfers: {
                    requested: true
                },
                card_payments: {
                    requested: true,
                }
            }
        });
    }

    async createExpressAccountLink({ accountId }: { accountId: string; }) {
        const frontendUrl = await this.configService.get('frontendUrl');

        return this.stripeClient.accountLinks.create({
            account: accountId,
            refresh_url: `${frontendUrl}/dashboard/profile`,
            return_url: `${frontendUrl}/dashboard/profile`,
            type: "account_onboarding",
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

    async createPaymentIntent({ templatePrice, templateCurrency, stripeAccountId }: { templatePrice: number, templateCurrency: string; stripeAccountId: ICommonUserDTO["stripeAccountId"] }) {
        const amount = templatePrice * 100;

        return this.stripeClient.paymentIntents.create({
            amount,
            currency: templateCurrency,
            // application_fee_amount: amount * 0.05,
            transfer_data: {
                amount: (amount - amount * 0.05) - 30,
                destination: stripeAccountId
            },
        });
    }

    async getPaymentIntent({ paymentIntentId }: { paymentIntentId: string }) {
        return this.stripeClient.paymentIntents.retrieve(paymentIntentId);
    }

    async cancelPaymentIntent({ paymentIntentId }: { paymentIntentId: string }) {
        return this.stripeClient.paymentIntents.cancel(
            paymentIntentId
        );
    }

    async createWebhookEvent({ body, sig }): Promise<Stripe.Event | undefined> {
        try {
            const secret = await this.configService.get('stripeWebhookSecret');

            return this.stripeClient.webhooks.constructEvent(
                body,
                sig,
                secret
            );
        } catch (e) {
            console.log(`⚠️  Webhook signature verification failed.`, e.message);
            return;
        }
    }
}
