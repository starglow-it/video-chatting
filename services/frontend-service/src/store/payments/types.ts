import { PaymentType } from 'shared-const';
import { IUserTemplate, MeetingRole } from 'shared-types';

export type CancelPaymentIntentPayload = { paymentIntentId: string };
export type CreatePaymentIntentPayload = {
    templateId: IUserTemplate['id'];
    meetingRole: MeetingRole;
    paymentType: PaymentType;
};
export type LoginStripeAccountResponse = { url: string } | undefined;
export type ConnectStripeAccountResponse = { url: string } | undefined;
