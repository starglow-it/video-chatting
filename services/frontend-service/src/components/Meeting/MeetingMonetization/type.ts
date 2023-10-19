import { StripeCurrency } from 'shared-const';

export type FormDataPayment = {
    enabledMeeting: boolean;
    enabledPaywall: boolean;
    templatePrice: number;
    paywallPrice: number;
    templateCurrency: StripeCurrency;
    paywallCurrency: StripeCurrency;
};
