import { CustomMediaStream } from '../../../../types';

export type JoinMeetingEventPayload = {
    needToRememberSettings: boolean;
    isSettingsAudioBackgroundActive: boolean;
    settingsBackgroundAudioVolume: number;
};

export type JoinMeetingFxPayload = JoinMeetingEventPayload & {
    isMicActive: boolean;
    isCameraActive: boolean;
    isOwner: boolean;
    isOwnerInMeeting: boolean;
    isMeetingInstanceExists: boolean;
    changeStream: CustomMediaStream;
    isAuraActive: boolean;
    currentVideoDevice: string;
    currentAudioDevice: string;
};
