import { MediaStreamError } from 'src/helpers/media/getMediaStream';
import { CustomMediaStream } from '../../../types';

export type MediaPreviewProps = {
    isMicActive: boolean;
    isCameraActive: boolean;
    userName: string;
    onToggleAudio?: () => void;
    onToggleVideo?: () => void;
    videoError?: MediaStreamError;
    audioError?: MediaStreamError;
    profileAvatar?: string;
    videoDevices: MediaDeviceInfo[];
    audioDevices: MediaDeviceInfo[];
    stream: CustomMediaStream;
    isUnlockAccess?: boolean;
    onChangeAvatar?: (avatar: string) => void;
    devicesSettingsDialog?: boolean;
};
