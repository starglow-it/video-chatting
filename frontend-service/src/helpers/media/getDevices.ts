import { AUDIO_INPUT, INPUT_KIND_ARRAY, VIDEO_INPUT } from '../../const/media/DEVICE_KINDS';
import { MediaStreamOptions } from './types';

export const getDevices = async (): Promise<{
    audio: MediaDeviceInfo[];
    video: MediaDeviceInfo[];
}> => {
    const allDevices = await navigator.mediaDevices.enumerateDevices();

    const inputDevices = allDevices.filter(
        device =>
            Boolean(device.label) &&
            device.deviceId !== 'default' &&
            INPUT_KIND_ARRAY.includes(device.kind),
    );

    const audioDevices = inputDevices.filter(device => device.kind === AUDIO_INPUT);
    const videoDevices = inputDevices.filter(device => device.kind === VIDEO_INPUT);

    return {
        audio: audioDevices,
        video: videoDevices,
    };
};

export const getDevicesFromStream = (stream?: MediaStream | null | undefined): MediaStreamOptions => {
    const initialValue = {
        audioDeviceId: '',
        videoDeviceId: '',
    };

    if (stream) {
        return stream.getTracks().reduce(
            (a, b) => ({
                ...a,
                [`${b.kind}DeviceId`]: b.getSettings().deviceId,
            }),
            initialValue,
        );
    }
    return initialValue;
};
