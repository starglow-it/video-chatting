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
};
