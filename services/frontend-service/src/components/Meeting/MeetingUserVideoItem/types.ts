import { MeetingUser } from '../../../store/types';
import { CustomMediaStream } from '../../../types';

export type MeetingUserVideoItemProps = {
    userName: MeetingUser['username'];
    userId: MeetingUser['id'];
    userProfileAvatar: MeetingUser['profileAvatar'] | string;
    userIndexElevation?: number;
    size: number;
    isCameraEnabled: boolean;
    isMicEnabled: boolean;
    isLocal?: boolean;
    isScreenSharingUser: boolean;
    isScreenSharing: boolean;
    isAuraActive: boolean;
    onToggleAudio?: () => void;
    onToggleVideo?: () => void;
    localStream?: CustomMediaStream;
    bottom: number | undefined;
    left: number | undefined;
    onResizeVideo?: (size: number) => void;
    isSelfView?: boolean;
};

export type MeetingUserVideoComProps = {
    isLocal?: boolean;
    localStream?: CustomMediaStream;
    userId: MeetingUser['id'];
    isCameraEnabled: boolean;
    scale: number;
    isMicEnabled: boolean;
    userName: MeetingUser['username'];
    userProfileAvatar: MeetingUser['profileAvatar'] | string;
    onToggleVideo?: () => void;
    isScreenSharingUser: boolean;
    isScreenSharing: boolean;
    isAuraActive: boolean;
    isSelfView?: boolean;
}