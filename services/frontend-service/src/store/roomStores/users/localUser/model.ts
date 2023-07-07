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
};

export const $localUserStore = meetingUsersDomain.store<MeetingUser>(
    initialMeetingUserState,
);

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
