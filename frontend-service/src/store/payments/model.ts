import { attach, combine } from 'effector-next';
import { paymentsDomain } from '../domains';

import { $meetingTemplateStore } from '../meeting/meetingTemplate/model';
import { ErrorState, PaymentIntentStore } from '../types';
import {
    CancelPaymentIntentPayload,
    ConnectStripeAccountResponse,
    CreatePaymentIntentPayload,
    LoginStripeAccountResponse,
} from './types';

export const $paymentIntent = paymentsDomain.store<PaymentIntentStore>({
    id: '',
    clientSecret: '',
});

export const connectStripeAccountFx = paymentsDomain.createEffect<
    void,
    ConnectStripeAccountResponse,
    ErrorState
>('connectStripeAccount');
export const loginStripeAccountFx = paymentsDomain.effect<
    void,
    LoginStripeAccountResponse,
    ErrorState
>('loginStripeAccountFx');
export const deleteStripeAccountFx = paymentsDomain.effect<void, void, ErrorState>(
    'deleteStripeAccountFx',
);
export const createPaymentIntentFx = paymentsDomain.effect<
    CreatePaymentIntentPayload,
    PaymentIntentStore,
    ErrorState
>('createPaymentIntentFx');
export const cancelPaymentIntentFx = paymentsDomain.effect<
    CancelPaymentIntentPayload,
    void,
    ErrorState
>('cancelPaymentIntentFx');

export const createPaymentIntentWithData = attach({
    effect: createPaymentIntentFx,
    source: combine({ meetingTemplate: $meetingTemplateStore }),
    mapParams: (params, { meetingTemplate }) => ({
        templateId: meetingTemplate.id,
    }),
});

export const cancelPaymentIntentWithData = attach({
    effect: cancelPaymentIntentFx,
    source: combine({ paymentIntent: $paymentIntent }),
    mapParams: (params, { paymentIntent }) => ({
        paymentIntentId: paymentIntent.id,
    }),
});
