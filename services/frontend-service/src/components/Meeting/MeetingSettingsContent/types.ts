export type MeetingSettingsContentProps = {
    title: unknown;
    isBackgroundActive: boolean;
    onBackgroundToggle: () => void;
    backgroundVolume: number;
    onChangeBackgroundVolume: (volume: number) => void;
    isAuraActive: boolean;
    onToggleAura: () => void;
    isMonetizationEnabled: boolean;
    isMonetizationAvailable: boolean;
    isAudioActive: boolean;
    stream?: MediaStream | undefined | null;
};
