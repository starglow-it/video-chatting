import { ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';

import { meetingUsersDomain } from '../domain';

import { JoinMeetingResult, MeetingAccessStatuses, MeetingUser } from '../../types';

const initialMeetingUserState: MeetingUser = {
    id: '',
    profileId: '',
    socketId: '',
    username: '',
    accessStatus: MeetingAccessStatuses.EnterName,
    cameraStatus: 'active',
    micStatus: 'active',
    profileAvatar: '',
    meeting: '',
    isGenerated: false,
};

export const $localUserStore = meetingUsersDomain.store<MeetingUser>(initialMeetingUserState);

export const setLocalUserEvent = meetingUsersDomain.event<JoinMeetingResult>('setLocalUserEvent');
export const resetLocalUserStore = meetingUsersDomain.event('resetLocalUserStore');
export const setLocalUserMediaEvent =
    meetingUsersDomain.event<{ audioTrack: ILocalAudioTrack; videoTrack: ILocalVideoTrack }>(
        'setLocalUserMediaEvent',
    );
export const updateLocalUserStateEvent = meetingUsersDomain.event<Partial<MeetingUser>>(
    'updateLocalUserStateEvent',
);
export const updateLocalUserEvent =
    meetingUsersDomain.event<JoinMeetingResult>('updateLocalUserEvent');
