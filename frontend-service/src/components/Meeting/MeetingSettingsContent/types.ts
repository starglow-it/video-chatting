export type MeetingSettingsContentProps = {
    title: any;
    volume: nubmer;
    onChangeVolume: (newVolume: number) => void;
    stream?: MediaStream | undefined;
    isBackgroundAudioActive: boolean;
    onToggleAudioBackground: () => void;
};
