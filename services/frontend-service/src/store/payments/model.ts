import { attach, Store } from 'effector-next';
import { paymentsDomain } from '../domains';

import { $meetingTemplateStore } from '../roomStores';
import { ErrorState, PaymentIntentStore, UserTemplate } from '../types';
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

export const createPaymentIntentWithData = attach<
    void,
    Store<UserTemplate>,
    typeof createPaymentIntentFx
>({
    effect: createPaymentIntentFx,
    source: $meetingTemplateStore,
    mapParams: (params, meetingTemplate) => ({
        templateId: meetingTemplate.id,
    }),
});

export const cancelPaymentIntentWithData = attach<
    void,
    Store<PaymentIntentStore>,
    typeof cancelPaymentIntentFx
>({
    effect: cancelPaymentIntentFx,
    source: $paymentIntent,
    mapParams: (params, paymentIntent) => ({
        paymentIntentId: paymentIntent.id,
    }),
});
