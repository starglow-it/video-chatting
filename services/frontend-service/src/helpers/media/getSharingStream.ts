import { CustomMediaStream } from '../../types';

export const getSharingStream = async (): Promise<CustomMediaStream> =>
    navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: {
            frameRate: 30,
        },
    });
