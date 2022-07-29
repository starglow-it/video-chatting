import { ILocalAudioTrack, ILocalVideoTrack } from 'agora-rtc-sdk-ng';

import { meetingUsersDomain } from '../domain/model';

import { MeetingAccessStatuses, MeetingUser } from '../../types';

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
    isAuraActive: false,
};

export const $localUserStore = meetingUsersDomain.store<MeetingUser>(initialMeetingUserState);

export const resetLocalUserStore = meetingUsersDomain.event('resetLocalUserStore');

export const setLocalUserMediaEvent = meetingUsersDomain.event<{
    audioTrack: ILocalAudioTrack;
    videoTrack: ILocalVideoTrack;
}>('setLocalUserMediaEvent');

export const updateLocalUserEvent =
    meetingUsersDomain.event<Partial<MeetingUser>>('updateLocalUserEvent');

export const leaveMeetingEvent = meetingUsersDomain.event('leaveMeetingEvent');
