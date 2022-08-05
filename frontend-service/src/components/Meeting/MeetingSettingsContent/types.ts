export type MeetingSettingsContentProps = {
    title: any;
    isBackgroundActive: boolean;
    onBackgroundToggle: () => void;
    backgroundVolume: number;
    onChangeBackgroundVolume: (volume: number) => void;
    isBlurActive: boolean;
    onToggleBlur: () => void;
    isMonetizationEnabled: boolean;
    isAudioActive: boolean;
    stream?: MediaStream | undefined | null;
};
