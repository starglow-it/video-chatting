import { attach, Store } from 'effector-next';
import { paymentsDomain } from '../../../domains';
import { CancelPaymentIntentPayload, CreatePaymentIntentPayload } from '../../../payments/types';
import { ErrorState, PaymentIntentStore, UserTemplate } from '../../../types';
import { $meetingTemplateStore } from '../meetingTemplate/model';

export const $paymentIntent = paymentsDomain.store<PaymentIntentStore>({
    id: '',
    clientSecret: '',
});

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
