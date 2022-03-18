export type MediaPreviewProps = {
    onToggleAudio?: () => void;
    onToggleVideo?: () => void;
    stream: MediaStream | null;
};
