import {
    ILocalAudioTrack,
    ILocalVideoTrack,
    IRemoteAudioTrack,
    IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng';

import { MeetingUser } from '../../../store/types';

export type MeetingUserVideoItemProps = {
    userName: MeetingUser['username'];
    userProfileAvatar: MeetingUser['profileAvatar'] | string;
    videoTrack: IRemoteVideoTrack | ILocalVideoTrack | undefined;
    audioTrack: IRemoteAudioTrack | ILocalAudioTrack | undefined;
    userIndexElevation?: number;
    size: number;
    isCameraEnabled: boolean;
    isMicEnabled: boolean;
    isLocal?: boolean;
    isScreensharingUser: boolean;
    isScreenSharing: boolean;
    isAuraActive: boolean;
    onToggleAudio?: () => void;
    onToggleVideo?: () => void;
};
