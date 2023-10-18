import { attach, combine, Store } from 'effector-next';
import { ErrorState, IUserTemplate } from 'shared-types';

import { meetingDomain, paymentsDomain } from '../../../domains';
import {
    CancelPaymentIntentPayload,
    CreatePaymentIntentPayload,
} from '../../../payments/types';
import { PaymentIntentParams, PaymentIntentStore } from '../../../types';
import { $meetingTemplateStore } from '../meetingTemplate/model';
import {
    GetPaymentMeetingPayload,
    MeetingPayment,
    UpdatePaymentMeetingPayload,
    UpdatePaymentMeetingResponse,
} from './type';
import { DEFAULT_PAYMENT_CURRENCY } from 'shared-const';
import { $isParticipant } from '../meetingRole/model';

export const $paymentIntent = paymentsDomain.createStore<PaymentIntentStore>({
    id: '',
    clientSecret: '',
});

export const $isTogglePayment = paymentsDomain.createStore<boolean>(false);

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
        isPaymentPaywall: Boolean(params?.isPaymentPaywall),
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
        isPaymentPaywall: Boolean(params?.isPaymentPaywall),
    }),
});

export const $meetingPaymentStore = meetingDomain.createStore<MeetingPayment>({
    meeting: {
        enabled: false,
        price: 5,
        currency: DEFAULT_PAYMENT_CURRENCY,
    },
    paywall: {
        enabled: false,
        price: 5,
        currency: DEFAULT_PAYMENT_CURRENCY,
    },
});

export const $enabledPaymentMeeting = combine({
    isParticipant: $isParticipant,
    meetingPayment: $meetingPaymentStore,
}).map(
    ({ isParticipant, meetingPayment: { meeting } }) =>
        isParticipant && meeting.enabled,
);

export const $enabledPaymentPaywall = combine({
    isParticipant: $isParticipant,
    meetingPayment: $meetingPaymentStore,
}).map(
    ({ isParticipant, meetingPayment: { paywall } }) =>
        isParticipant && paywall.enabled,
);

export const getPaymentMeetingFx = meetingDomain.createEffect<
    GetPaymentMeetingPayload,
    MeetingPayment
>('getPaymentMeetingFx');

export const updatePaymentMeetingFx = meetingDomain.createEffect<
    UpdatePaymentMeetingPayload,
    UpdatePaymentMeetingResponse
>('updatePaymentMeetingFx');

export const getPaymentMeetingEvent = attach({
    effect: getPaymentMeetingFx,
});

export const updatePaymentMeetingEvent = attach<
    MeetingPayment,
    Store<IUserTemplate>,
    typeof updatePaymentMeetingFx
>({
    effect: updatePaymentMeetingFx,
    source: $meetingTemplateStore,
    mapParams: (data, template) => ({
        data,
        templateId: template.id,
    }),
});
