import { attach, Store } from 'effector-next';
import { ErrorState, IUserTemplate } from 'shared-types';

import { paymentsDomain } from '../../../domains';
import {
    CancelPaymentIntentPayload,
    CreatePaymentIntentPayload,
} from '../../../payments/types';
import { PaymentIntentParams, PaymentIntentStore } from '../../../types';
import { $meetingTemplateStore } from '../meetingTemplate/model';

export const $paymentIntent = paymentsDomain.store<PaymentIntentStore>({
    id: '',
    clientSecret: '',
});

export const $isTogglePayment = paymentsDomain.store<boolean>(false);

export const togglePaymentFormEvent = paymentsDomain.event<boolean | undefined>(
    'togglePaymentFormEvent',
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
    PaymentIntentParams | void,
    Store<IUserTemplate>,
    typeof createPaymentIntentFx
>({
    effect: createPaymentIntentFx,
    source: $meetingTemplateStore,
    mapParams: (params, meetingTemplate) => ({
        templateId: meetingTemplate.id,
        isPaymentPaywall: Boolean(params?.isPaymentPaywall)
    }),
});

export const cancelPaymentIntentWithData = attach<
    PaymentIntentParams | void,
    Store<PaymentIntentStore>,
    typeof cancelPaymentIntentFx
>({
    effect: cancelPaymentIntentFx,
    source: $paymentIntent,
    mapParams: (params, paymentIntent) => ({
        paymentIntentId: paymentIntent.id,
        isPaymentPaywall: Boolean(params?.isPaymentPaywall)
    }),
});
