import { ICommonTemplate, ICommonUser } from '../api-interfaces';

export type LoginStripeExpressAccountPayload = { accountId: string };
export type DeleteStripeExpressAccountPayload = { accountId: string };
export type CancelPaymentIntentPayload = { paymentIntentId: string };
export type GetStripePortalSessionPayload = { subscriptionId: string };
export type GetStripeSubscriptionPayload = { subscriptionId: string };
export type GetStripeTemplateProductPayload = { productId: string };

export type CreateStripeExpressAccountPayload = {
  accountId: ICommonUser['stripeAccountId'];
  email: ICommonUser['email'] | ICommonUser['contactEmail'];
};
export type CreateStripeAccountLinkPayload = {
  accountId: ICommonUser['stripeAccountId'];
};
export type CreatePaymentIntentPayload = {
  stripeSubscriptionId: string;
  templatePrice: number;
  templateCurrency: string;
  platformFee: number;
  stripeAccountId: ICommonUser['stripeAccountId'];
  templateId: ICommonTemplate['id'];
};

export type GetStripeCheckoutSessionPayload = {
  productId: string;
  meetingToken: string;
  baseUrl: string;
  cancelUrl?: string;
  customerEmail?: string;
  customer?: string;
  withTrial?: boolean;
};
export type CreateStripeTemplateProductPayload = {
  name: string;
  priceInCents: number;
  description: string;
};

export type DeleteTemplateStripeProductPayload = {
  productId: string;
};

export type GetStripeTemplateProductByNamePayload = {
  name: string;
};

export type GetProductCheckoutSessionPayload = {
  productId: string;
  templateId: string;
  userId: string;
  customerEmail: string;
  customer: string;
};

export type GetStripeChargesPayload = {
  time: number;
  type?: string;
};

export type CancelUserSubscriptionPayload = {
  subscriptionId: ICommonUser['id'];
};
