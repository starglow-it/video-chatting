import { VideoJsPlayerOptions } from 'video.js';

export type CustomVideoPlayerProps = {
    options: VideoJsPlayerOptions;
    className?: string;
    isPlaying?: boolean;
    isMuted?: boolean;
    volume?: number;
};
