import { attach, combine, Store, StoreShape } from 'effector-next';
import { ErrorState, IUserTemplate, MeetingRole } from 'shared-types';

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
    PaymentItem,
    UpdatePaymentMeetingParams,
    UpdatePaymentMeetingPayload,
    UpdatePaymentMeetingResponse,
} from './type';
import { DEFAULT_PAYMENT_CURRENCY, PaymentType } from 'shared-const';
import { $isLurker, $isParticipant } from '../meetingRole/model';

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

export const $meetingPaymentStore = meetingDomain.createStore<MeetingPayment>(
    [],
);

export const $enabledPaymentMeetingParticipant = combine({
    isParticipant: $isParticipant,
    meetingPayment: $meetingPaymentStore,
}).map(
    ({ isParticipant, meetingPayment }) =>
        isParticipant &&
        meetingPayment.some(
            item =>
                item.meetingRole === MeetingRole.Participant &&
                item.enabled &&
                item.type === PaymentType.Meeting,
        ),
);

export const $enabledPaymentPaywallParticipant = combine({
    isParticipant: $isParticipant,
    meetingPayment: $meetingPaymentStore,
}).map(
    ({ isParticipant, meetingPayment }) =>
        isParticipant &&
        meetingPayment.some(
            item =>
                item.meetingRole === MeetingRole.Participant &&
                item.enabled &&
                item.type === PaymentType.Paywall,
        ),
);

export const $enabledPaymentMeetingLurker = combine({
    isLurker: $isLurker,
    meetingPayment: $meetingPaymentStore,
}).map(
    ({ isLurker, meetingPayment }) =>
        isLurker &&
        meetingPayment.some(
            item =>
                item.meetingRole === MeetingRole.Lurker &&
                item.enabled &&
                item.type === PaymentType.Meeting,
        ),
);

export const $enabledPaymentPaywallLurker = combine({
    isLurker: $isLurker,
    meetingPayment: $meetingPaymentStore,
}).map(
    ({ isLurker, meetingPayment }) =>
        isLurker &&
        meetingPayment.some(
            item =>
                item.meetingRole === MeetingRole.Lurker &&
                item.enabled &&
                item.type === PaymentType.Paywall,
        ),
);

export const $paymentMeetingParticipant = $meetingPaymentStore.map(
    payments =>
        payments.find(
            item =>
                item.type === PaymentType.Meeting &&
                item.meetingRole === MeetingRole.Participant,
        ) ??
        ({
            enabled: false,
            price: 5,
            type: PaymentType.Meeting,
            meetingRole: MeetingRole.Participant,
            currency: DEFAULT_PAYMENT_CURRENCY,
        } as PaymentItem),
);

export const $paymentMeetingLurker = $meetingPaymentStore.map(
    payments =>
        payments.find(
            item =>
                item.type === PaymentType.Meeting &&
                item.meetingRole === MeetingRole.Lurker,
        ) ??
        ({
            enabled: false,
            price: 5,
            type: PaymentType.Meeting,
            meetingRole: MeetingRole.Lurker,
            currency: DEFAULT_PAYMENT_CURRENCY,
        } as PaymentItem),
);

export const $paymentPaywallParticipant = $meetingPaymentStore.map(
    payments =>
        payments.find(
            item =>
                item.type === PaymentType.Paywall &&
                item.meetingRole === MeetingRole.Participant,
        ) ??
        ({
            enabled: false,
            price: 5,
            type: PaymentType.Paywall,
            meetingRole: MeetingRole.Participant,
            currency: DEFAULT_PAYMENT_CURRENCY,
        } as PaymentItem),
);

export const $paymentPaywallLurker = $meetingPaymentStore.map(
    payments =>
        payments.find(
            item =>
                item.type === PaymentType.Paywall &&
                item.meetingRole === MeetingRole.Lurker,
        ) ??
        ({
            enabled: false,
            price: 5,
            type: PaymentType.Paywall,
            meetingRole: MeetingRole.Lurker,
            currency: DEFAULT_PAYMENT_CURRENCY,
        } as PaymentItem),
);

export const getPaymentMeetingFx = meetingDomain.createEffect<
    GetPaymentMeetingPayload,
    MeetingPayment
>('getPaymentMeetingFx');

export const updatePaymentMeetingFx = meetingDomain.createEffect<
    UpdatePaymentMeetingPayload,
    UpdatePaymentMeetingResponse
>('updatePaymentMeetingFx');

export const getPaymentMeetingEvent = attach<
    string,
    any,
    typeof getPaymentMeetingFx
>({
    effect: getPaymentMeetingFx,
    source: undefined,
    mapParams: templateId => ({ templateId }),
});

export const updatePaymentMeetingEvent = attach<
    UpdatePaymentMeetingParams,
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
