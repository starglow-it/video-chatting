import { MeetingRole } from 'shared-types';
import { CustomMediaStream } from '../../../../types';

export type JoinMeetingEventPayload = {
    needToRememberSettings: boolean;
    isSettingsAudioBackgroundActive: boolean;
    settingsBackgroundAudioVolume: number;
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
};

export type JoinMeetingWithAudienceFxPayload = {
    isMicActive: boolean;
    isCameraActive: boolean;
    changeStream: CustomMediaStream;
    isAuraActive?: boolean;
    currentVideoDevice: string;
    currentAudioDevice: string;
};
