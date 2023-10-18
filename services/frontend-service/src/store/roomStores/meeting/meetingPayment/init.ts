import { meetingDomain } from 'src/store/domains';
import { DEFAULT_PAYMENT_CURRENCY } from 'shared-const';
import { combine } from 'effector';
import { GetPaymentMeetingPayload, MeetingPayment } from './type';
import { $isParticipant } from '../meetingRole/model';

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

export const getPaymentMeetingEvent = meetingDomain.createEvent(
    'getPaymentMeetingEvent',
);

export const getPaymentMeetingFx = meetingDomain.createEffect<
    GetPaymentMeetingPayload,
    MeetingPayment
>('getPaymentMeetingFx');

export const updatePaymentMeetingEvent = meetingDomain.createEvent(
    'updatePaymentMeetingEvent',
);

export const updatePaymentMeetingFx = meetingDomain.createEvent(
    'updatePaymentMeetingFx',
);
