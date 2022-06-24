import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';

import { meetingUsersDomain } from '../domain/model';

import { JoinMeetingResult, MeetingUser } from '../../types';

export const $meetingUsersStore = meetingUsersDomain.store<MeetingUser[]>([]);

export const updateMeetingUsersEvent =
    meetingUsersDomain.event<JoinMeetingResult>('updateMeetingUsersEvent');
export const removeMeetingUsersEvent =
    meetingUsersDomain.event<{ users: MeetingUser['id'][] }>('removeMeetingUsersEvent');
export const updateMeetingUserEvent =
    meetingUsersDomain.event<JoinMeetingResult>('updateMeetingUserEvent');
export const resetMeetingUsersStore = meetingUsersDomain.event('resetMeetingUsersStore');
export const setMeetingUserMediaEvent = meetingUsersDomain.event<IAgoraRTCRemoteUser>(
    'setMeetingUserMediaEvent',
);
export const updateUserTracksEvent =
    meetingUsersDomain.event<{ userUid: MeetingUser['meetingUserId']; infoType: string }>(
        'updateUserTracksEvent',
    );
