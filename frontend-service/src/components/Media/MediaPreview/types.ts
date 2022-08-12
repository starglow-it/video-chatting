import { CustomMediaStream } from '../../../types';

export type MediaPreviewProps = {
    onToggleAudio?: () => void;
    onToggleVideo?: () => void;
    stream: CustomMediaStream;
};
