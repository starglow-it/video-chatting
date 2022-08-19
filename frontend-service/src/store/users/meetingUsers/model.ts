import { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';

import { meetingUsersDomain } from '../domain/model';

import { MeetingUser } from '../../types';
import {
    RemoveUsersPayload,
    UpdateMeetingUserPayload,
    UpdateMeetingUsersPayload,
    UpdateUserTracksPayload,
} from '../../socket/types';

export const $meetingUsersStore = meetingUsersDomain.store<MeetingUser[]>([]);

export const updateMeetingUsersEvent =
    meetingUsersDomain.event<UpdateMeetingUsersPayload>('updateMeetingUsersEvent');
export const removeMeetingUsersEvent =
    meetingUsersDomain.event<RemoveUsersPayload>('removeMeetingUsersEvent');
export const updateMeetingUserEvent =
    meetingUsersDomain.event<UpdateMeetingUserPayload>('updateMeetingUserEvent');
export const updateUserTracksEvent =
    meetingUsersDomain.event<UpdateUserTracksPayload>('updateUserTracksEvent');
export const resetMeetingUsersStore = meetingUsersDomain.event('resetMeetingUsersStore');
export const setMeetingUserMediaEvent = meetingUsersDomain.event<IAgoraRTCRemoteUser>(
    'setMeetingUserMediaEvent',
);
