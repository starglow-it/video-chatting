export type CustomMediaStream = MediaStream | null | undefined;
export type recordMeetingRequest = {
    url: string
};
export type recordMeetingResponse = {
    message: string,
    egressId?: string | undefined,
    url?: string | undefined,
    error?: string | undefined
} | null;

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


export type VideoBlob = Blob | null;
