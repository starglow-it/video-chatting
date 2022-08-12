export type MeetingSettingsContentProps = {
    title: any;
    isBackgroundActive: boolean;
    onBackgroundToggle: () => void;
    backgroundVolume: number;
    onChangeBackgroundVolume: (volume: number) => void;
    isBlurActive: boolean;
    onToggleBlur: () => void;
    isMonetizationEnabled: boolean;
    isMonetizationAvailable: boolean;
    isAudioActive: boolean;
    stream?: MediaStream | undefined | null;
};
