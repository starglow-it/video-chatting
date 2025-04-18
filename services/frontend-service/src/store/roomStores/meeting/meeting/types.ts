import { MeetingRole } from 'shared-types';
import { CustomMediaStream } from '../../../../types';

export type JoinMeetingEventPayload = {
    needToRememberSettings: boolean;
    isSettingsAudioBackgroundActive: boolean;
    settingsBackgroundAudioVolume: number;
};

export type NotifyToHostWhileWaitingRoomPayload = {
    roomId: string;
    localUserId: string;
};

export type GetMeetingUsersStatisticsPayload = {
    meetingId?: string,
    userId: string
};

export type JoinMeetingFxPayload = JoinMeetingEventPayload & {
    isMicActive: boolean;
    isCameraActive: boolean;
    meetingRole: MeetingRole;
    isOwnerInMeeting: boolean;
    isMeetingInstanceExists: boolean;
    changeStream: CustomMediaStream;
    isAuraActive: boolean;
    currentVideoDevice: string;
    currentAudioDevice: string;
    isOwnerDoNotDisturb: boolean;
};

export type JoinMeetingWithAudienceFxPayload = {
    isMicActive: boolean;
    isCameraActive: boolean;
    changeStream: CustomMediaStream;
    isAuraActive?: boolean;
    currentVideoDevice: string;
    currentAudioDevice: string;
};
