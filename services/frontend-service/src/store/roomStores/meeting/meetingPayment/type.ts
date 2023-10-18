import { PaymentType, StripeCurrency } from 'shared-const';
import { ErrorState } from 'shared-types';

export type PaymentItem = {
    currency: StripeCurrency;
    price: number;
    enabled: boolean;
};

export type MeetingPayment = {
    [k in PaymentType]: {
        currency: StripeCurrency;
        price: number;
        enabled: boolean;
    };
};

export type UpdatePaymentMeetingParams = Partial<MeetingPayment>;

// {
//     [PaymentType.Meeting]?: PaymentItem;
//     [PaymentType.Paywall]?: PaymentItem;
// };

export type GetPaymentMeetingPayload = {
    templateId: string;
};

export type UpdatePaymentMeetingPayload = {
    templateId: string;
    data: UpdatePaymentMeetingParams;
};

export type UpdatePaymentMeetingResponse = {
    success: boolean;
    data?: MeetingPayment;
} & ErrorState;
