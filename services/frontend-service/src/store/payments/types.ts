import { UserTemplate } from '../types';

export type CancelPaymentIntentPayload = { paymentIntentId: string };
export type CreatePaymentIntentPayload = { templateId: UserTemplate['id'] };
export type LoginStripeAccountResponse = { url: string } | undefined;
export type ConnectStripeAccountResponse = { url: string } | undefined;
