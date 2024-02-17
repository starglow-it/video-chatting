import { attach, combine, Store } from 'effector-next';
import { ErrorState, IUserTemplate, MeetingRole } from 'shared-types';

import { DEFAULT_PAYMENT_CURRENCY, DEFAULT_PRICE, PaymentType } from 'shared-const';
import { meetingDomain, paymentsDomain } from '../../../domains';
import {
    CancelPaymentIntentPayload,
    CreatePaymentIntentPayload,
} from '../../../payments/types';
import {
    MeetingUser,
    PaymentIntentParams,
    PaymentIntentStore,
    PaymentExistStore
} from '../../../types';
import { $meetingTemplateStore } from '../meetingTemplate/model';
import {
    GetPaymentMeetingPayload,
    MeetingPayment,
    PaymentItem,
    UpdatePaymentMeetingParams,
    UpdatePaymentMeetingPayload,
    UpdatePaymentMeetingResponse,
} from './type';
import { $isAudience, $isParticipant } from '../meetingRole/model';
import { $localUserStore } from '../../users/localUser/model';

const initialCreateRoomPaymentStore = {
    meeting: {
        participant: {
            enabled: false,
            price: 0,
            currency: DEFAULT_PAYMENT_CURRENCY,
        },
        audience: {
            enabled:false,
            price: 0,
            currency: DEFAULT_PAYMENT_CURRENCY,
        },
    },
    paywall: {
        participant: {
            enabled: false,
            price: 0,
            currency: DEFAULT_PAYMENT_CURRENCY,
        },
        audience: {
            enabled: false,
            price: 0,
            currency: DEFAULT_PAYMENT_CURRENCY,
        },
    },
};

export const $paymentIntent = paymentsDomain.createStore<PaymentIntentStore>({
    id: '',
    clientSecret: '',
});

export const $createRoomPaymentStore = paymentsDomain.createStore<UpdatePaymentMeetingParams>(initialCreateRoomPaymentStore);

export const $isToggleCreateRoomPayment = paymentsDomain.createStore<boolean>(false);
export const $isRoomPaywalledStore = paymentsDomain.createStore<boolean>(true);

export const $isTogglePayment = paymentsDomain.createStore<boolean>(false);

export const togglePaymentFormEvent = paymentsDomain.event<boolean | undefined>(
    'togglePaymentFormEvent',
);

export const toggleCreateRoomPaymentFormEvent = paymentsDomain.event<boolean | undefined>(
    'toggleCreateRoomPaymentFormEvent',
);

export const createPaymentIntentFx = paymentsDomain.effect<
    CreatePaymentIntentPayload,
    PaymentIntentStore,
    ErrorState
>('createPaymentIntentFx');

export const isRoomPaywalledFx = paymentsDomain.effect<
    CreatePaymentIntentPayload,
    PaymentExistStore,
    ErrorState
>('isRoomPaywalledFx');

export const cancelPaymentIntentFx = paymentsDomain.effect<
    CancelPaymentIntentPayload,
    void,
    ErrorState
>('cancelPaymentIntentFx');

export const createPaymentIntentWithData = attach<
    PaymentIntentParams,
    Store<{ meetingTemplate: IUserTemplate; localUser: MeetingUser }>,
    typeof createPaymentIntentFx
>({
    effect: createPaymentIntentFx,
    source: combine({
        meetingTemplate: $meetingTemplateStore,
        localUser: $localUserStore,
    }),
    mapParams: (params, { meetingTemplate, localUser }) => ({
        templateId: meetingTemplate.id,
        meetingRole: localUser.meetingRole,
        paymentType: params.paymentType,
    }),
});

export const cancelPaymentIntentWithData = attach<
    PaymentIntentParams | void,
    Store<PaymentIntentStore>,
    typeof cancelPaymentIntentFx
>({
    effect: cancelPaymentIntentFx,
    source: $paymentIntent,
    mapParams: (_, paymentIntent) => ({
        paymentIntentId: paymentIntent.id,
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
                item.type === PaymentType.Meeting &&
                item.price > 0,
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
                item.type === PaymentType.Paywall &&
                item.price > 0,
        ),
);

export const $enabledPaymentMeetingAudience = combine({
    isAudience: $isAudience,
    meetingPayment: $meetingPaymentStore,
}).map(
    ({ isAudience, meetingPayment }) =>
        isAudience &&
        meetingPayment.some(
            item =>
                item.meetingRole === MeetingRole.Audience &&
                item.enabled &&
                item.type === PaymentType.Meeting &&
                item.price > 0,
        ),
);

export const $enabledPaymentPaywallAudience = combine({
    isAudience: $isAudience,
    meetingPayment: $meetingPaymentStore,
}).map(
    ({ isAudience, meetingPayment }) =>
        isAudience &&
        meetingPayment.some(
            item =>
                item.meetingRole === MeetingRole.Audience &&
                item.enabled &&
                item.type === PaymentType.Paywall &&
                item.price > 0,
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
            price: DEFAULT_PRICE.participant,
            type: PaymentType.Meeting,
            meetingRole: MeetingRole.Participant,
            currency: DEFAULT_PAYMENT_CURRENCY,
        } as PaymentItem),
);

export const $paymentMeetingAudience = $meetingPaymentStore.map(
    payments =>
        payments.find(
            item =>
                item.type === PaymentType.Meeting &&
                item.meetingRole === MeetingRole.Audience,
        ) ??
        ({
            enabled: false,
            price: DEFAULT_PRICE.audience,
            type: PaymentType.Meeting,
            meetingRole: MeetingRole.Audience,
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
            price: DEFAULT_PRICE.participant,
            type: PaymentType.Paywall,
            meetingRole: MeetingRole.Participant,
            currency: DEFAULT_PAYMENT_CURRENCY,
        } as PaymentItem),
);

export const $paymentPaywallAudience = $meetingPaymentStore.map(
    payments =>
        payments.find(
            item =>
                item.type === PaymentType.Paywall &&
                item.meetingRole === MeetingRole.Audience,
        ) ??
        ({
            enabled: false,
            price: DEFAULT_PRICE.audience,
            type: PaymentType.Paywall,
            meetingRole: MeetingRole.Audience,
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

export const setCreateRoomPaymentDataEvent = meetingDomain.createEffect<
UpdatePaymentMeetingParams,
Store<IUserTemplate>
>('setCreateRoomPaymentDataEvent');

export const receivePaymentMeetingEvent =
    meetingDomain.createEvent<MeetingPayment>('receivePaymentMeetingEvent');

export const createMeetingPaymentEvent =
    meetingDomain.createEvent<MeetingPayment>('createMeetingPaymentEvent');
