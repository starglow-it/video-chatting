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
    videoTrack?: IRemoteVideoTrack | ILocalVideoTrack;
    audioTrack?: IRemoteAudioTrack | ILocalAudioTrack;
    userIndexElevation?: number;
    size: number;
    isCameraEnabled: boolean;
    isMicEnabled: boolean;
    isLocal: boolean;
    withoutName: boolean;
    isScreensharingUser: boolean;
};
