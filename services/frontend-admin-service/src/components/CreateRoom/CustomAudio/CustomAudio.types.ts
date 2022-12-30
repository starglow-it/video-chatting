export type CustomAudioProps = {
    src?: string;
    isMuted?: boolean;
    onEnded?: () => void;
    onStarted?: (data: { duration: number }) => void;
};
