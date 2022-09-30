export type PropsWithClassName<T> = T & { className?: string };
export type CustomMediaStream = MediaStream | null | undefined;

export type ParsedTimeStamp = {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;
};

export type SavedSettings = {
    auraSetting: boolean;
    savedAudioDeviceId: MediaDeviceInfo['deviceId'];
    savedVideoDeviceId: MediaDeviceInfo['deviceId'];
    micActiveSetting: boolean;
    cameraActiveSetting: boolean;
    backgroundAudioVolumeSetting: number;
    backgroundAudioSetting: boolean;
};
