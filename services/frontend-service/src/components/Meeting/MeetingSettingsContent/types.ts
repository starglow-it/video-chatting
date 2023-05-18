export type MeetingSettingsContentProps = {
    title: unknown;
    isBackgroundActive: boolean;
    onBackgroundToggle: () => void;
    backgroundVolume: number;
    onChangeBackgroundVolume: (volume: number) => void;
    isAuraActive: boolean;
    onToggleAura: () => void;
    isAudioActive: boolean;
    stream?: MediaStream | undefined | null;
};
