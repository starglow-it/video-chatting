import { PaymentType, StripeCurrency } from 'shared-const';
import { ErrorState, MeetingRole } from 'shared-types';

type PaymentBase = {
    currency: StripeCurrency;
    price: number;
    enabled: boolean;
};

export type PaymentItem = PaymentBase & {
    type: PaymentType;
    meetingRole: MeetingRole;
};

export type MeetingPayment = PaymentItem[];

export type UpdatePaymentMeetingParams = {
    [K in PaymentType]: {
        [MeetingRole.Participant]: PaymentBase;
        [MeetingRole.Audience]: PaymentBase;
    };
};

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
