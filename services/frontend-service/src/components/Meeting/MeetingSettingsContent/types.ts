export type MeetingSettingsContentProps = {
    title: any;
    isBackgroundActive: boolean;
    onBackgroundToggle: () => void;
    backgroundVolume: number;
    onChangeBackgroundVolume: (volume: number) => void;
    isAuraActive: boolean;
    onToggleAura: () => void;
    isAudioActive: boolean;
    stream?: MediaStream | undefined | null;
    isMicrophone?: boolean;
    isCamera?: boolean;
    onToggleMicrophone?(): void;
    onToggleCamera?(): void;
};
