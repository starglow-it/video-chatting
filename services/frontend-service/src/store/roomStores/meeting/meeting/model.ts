import { combine } from 'effector-next';

import { Meeting } from '../../../types';
import { meetingDomain } from '../../../domains';
import { $localUserStore } from '../../users/localUser/model';
import { JoinMeetingEventPayload, JoinMeetingFxPayload } from './types';

const initialMeetingState: Meeting = {
    id: '',
    isMonetizationEnabled: false,
    mode: 'together',
    owner: '',
    users: [],
    ownerProfileId: '',
    hostUserId: '',
};

export const $meetingStore =
    meetingDomain.createStore<Meeting>(initialMeetingState);
export const $meetingConnectedStore = meetingDomain.createStore<boolean>(false);

export const $isMeetingHostStore = combine({
    localUser: $localUserStore,
    meeting: $meetingStore,
}).map(({ localUser, meeting }) => localUser.id === meeting.hostUserId);

export const $isScreenSharingStore = $meetingStore.map(meeting =>
    Boolean(meeting.sharingUserId),
);

export const updateMeetingEvent = meetingDomain.createEvent<{
    meeting?: Meeting;
}>('updateMeetingEvent');

export const setMeetingConnectedEvent = meetingDomain.createEvent<boolean>(
    'setMeetingConnectedEvent',
);

export const joinMeetingFx = meetingDomain.createEffect<
    JoinMeetingFxPayload,
    void
>('joinMeetingFx');

export const joinMeetingInWaitingRoomFx = meetingDomain.createEffect<
    void,
    void
>('joinMeetingInWaitingRoomFx');
export const joinMeetingEvent =
    meetingDomain.createEvent<JoinMeetingEventPayload>('joinMeetingEvent');
