import {IUserTemplate} from "shared-types";

export type CancelPaymentIntentPayload = { paymentIntentId: string };
export type CreatePaymentIntentPayload = { templateId: IUserTemplate['id'] };
export type LoginStripeAccountResponse = { url: string } | undefined;
export type ConnectStripeAccountResponse = { url: string } | undefined;
