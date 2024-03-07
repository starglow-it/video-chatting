import { combine } from 'effector-next';
import { MeetingAccessStatusEnum } from 'shared-types';
import { meetingUsersDomain } from '../domain/model';

import { MeetingUser } from '../../../types';

const initialMeetingUserState: MeetingUser = {
    id: '',
    profileId: '',
    socketId: '',
    username: '',
    accessStatus: MeetingAccessStatusEnum.Initial,
    cameraStatus: 'active',
    micStatus: 'active',
    profileAvatar: '',
    meeting: '',
    isGenerated: false,
    isAuraActive: false,
    doNotDisturb: false,
    isPaywallPaid: false
};

export const $localUserStore = meetingUsersDomain.createStore<MeetingUser>(
    initialMeetingUserState,
);

export const $isPaywallPaid = combine<{
    localUser: MeetingUser;
}>({
    localUser: $localUserStore,
}).map(({ localUser }: { localUser: MeetingUser }) =>
    localUser.isPaywallPaid
);

export const $isPaywallPaymentEnabled = meetingUsersDomain.createStore<boolean>(
    false,
);

export const setIsPaywallPaymentEnabled = meetingUsersDomain.event<
    boolean
>('setIsPaywallPaymentEnabled');
export const updateLocalUserEvent = meetingUsersDomain.event<
    Partial<MeetingUser>
>('updateLocalUserEvent');

export const leaveMeetingEvent = meetingUsersDomain.event('leaveMeetingEvent');
export const leaveExpiredMeetingEvent = meetingUsersDomain.event(
    'leaveExpiredMeetingEvent',
);
export const leaveDeletedUserMeetingEvent = meetingUsersDomain.event(
    'leaveDeletedUserMeetingEvent',
);
export const leaveMeetingAsHost =
    meetingUsersDomain.event('leaveMeetingAsHost');
export const leaveMeetingAsGuest = meetingUsersDomain.event(
    'leaveMeetingAsGuest',
);
