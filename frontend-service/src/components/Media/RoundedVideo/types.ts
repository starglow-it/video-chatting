export type RoundedVideoProps = {
    className?: string;
    userProfilePhoto: string;
    userName: string;
    isCameraActive?: boolean;
    isVideoAvailable?: boolean;
    isLocal?: boolean;
    size: number;
    videoRef?: HTMLVideoElement | null;
    isScreenSharing?: boolean;
    onToggleVideo?: () => void;
};
