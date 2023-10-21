import { ICommonTemplate, ICommonUser } from 'shared-types';

export type TCreatePaymentIntent = {
  templatePrice: number;
  templateCurrency: string;
  platformFee: number;
  stripeAccountId: ICommonUser['stripeAccountId'];
  templateId: ICommonTemplate['id'];
};
