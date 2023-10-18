import { meetingDomain } from 'src/store/domains';
import { DEFAULT_PAYMENT_CURRENCY } from 'shared-const';
import { attach, combine } from 'effector';
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

export const getPaymentMeetingFx = meetingDomain.createEffect<
    GetPaymentMeetingPayload,
    MeetingPayment
>('getPaymentMeetingFx');

export const updatePaymentMeetingFx = meetingDomain.createEffect<
    MeetingPayment,
    MeetingPayment
>('updatePaymentMeetingFx');

export const getPaymentMeetingEvent = attach({
    effect: getPaymentMeetingFx,
});

export const updatePaymentMeetingEvent = attach({
    effect: updatePaymentMeetingFx,
});
