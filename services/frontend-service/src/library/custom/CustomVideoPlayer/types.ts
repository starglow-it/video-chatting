export type CustomVideoPlayerOptions = {
    src: string;
    type: string;
}

export type CustomVideoPlayerProps = {
    options: CustomVideoPlayerOptions;
    className?: string;
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
};
