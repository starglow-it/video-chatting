import { PaymentType, StripeCurrency } from 'shared-const';

export type MeetingPayment = {
    [k in PaymentType]: {
        currency: StripeCurrency;
        price: number;
        enabled: boolean;
    };
};

export type GetPaymentMeetingPayload = {
    templateId: string;
};
