import { VIDEO_CONSTRAINTS } from '../../const/media/VIDEO_CONSTRAINTS';

import { MediaStreamOptions } from './types';

const MEDIA_STREAMS_ERROR = new Map([['Permission denied', 'media.notAllowed']]);

export const getMediaStream = async ({
    audioDeviceId,
    videoDeviceId,
}: MediaStreamOptions = {}): Promise<{
    stream?: MediaStream | null;
    error?: string;
}> => {
    try {
        const constraints = {
            video: {
                ...VIDEO_CONSTRAINTS,
                ...(videoDeviceId ? { deviceId: videoDeviceId } : {}),
            },
            audio: audioDeviceId ? { deviceId: audioDeviceId } : true,
        };

        return { stream: await navigator.mediaDevices.getUserMedia(constraints) };
    } catch (e: any) {
        return { error: MEDIA_STREAMS_ERROR.get(e.message) || e.message };
    }
};
