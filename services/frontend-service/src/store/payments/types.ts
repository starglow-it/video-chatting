import { PaymentType } from 'shared-const';
import { IUserTemplate, MeetingRole, ICommonUser } from 'shared-types';

export type CancelPaymentIntentPayload = { paymentIntentId: string };
export type CreatePaymentIntentPayload = {
    templateId: IUserTemplate['id'];
    meetingRole: MeetingRole;
    paymentType: PaymentType;
};
export type CreatePaymentIntentForRecordingVideoPayload = {
    userId: ICommonUser['id'];
    price: number;
};
export type LoginStripeAccountResponse = { url: string } | undefined;
export type ConnectStripeAccountResponse = { url: string } | undefined;
