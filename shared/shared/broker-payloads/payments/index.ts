import { ICommonUserDTO } from "../../interfaces/common-user.interface";

export type LoginStripeExpressAccountPayload = { accountId: string };
export type DeleteStripeExpressAccountPayload = { accountId: string };
export type CancelPaymentIntentPayload = { paymentIntentId: string };
export type GetStripePortalSessionPayload = { subscriptionId: string };
export type GetStripeSubscriptionPayload = { subscriptionId: string };
export type GetStripeTemplateProductPayload = { productId: string };

export type CreateStripeExpressAccountPayload = {
  accountId: ICommonUserDTO["stripeAccountId"];
  email: ICommonUserDTO["email"] | ICommonUserDTO["contactEmail"];
};
export type CreateStripeAccountLinkPayload = {
  accountId: ICommonUserDTO["stripeAccountId"];
};
export type CreatePaymentIntentPayload = {
  stripeSubscriptionId: string;
  templatePrice: number;
  templateCurrency: string;
  stripeAccountId: ICommonUserDTO["stripeAccountId"];
};
export type GetStripeCheckoutSessionPayload = {
  productId: string;
  meetingToken: string;
  baseUrl: string;
  customerEmail?: string;
  customer?: string;
  withTrial?: boolean;
};
export type CreateStripeTemplateProductPayload = {
  name: string;
  priceInCents: number;
  description: string;
};
export type GetProductCheckoutSessionPayload = {
  productId: string;
  customerEmail: string;
  customer: string;
};
