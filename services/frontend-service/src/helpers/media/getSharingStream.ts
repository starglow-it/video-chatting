import { CustomMediaStream } from '../../types';

export const getSharingStream = async (): Promise<CustomMediaStream> => {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('getUserMedia is not supported in this browser');
        }
        
        navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: {
                frameRate: 30,
            },
        });
    } catch (error) {
        console.log(error);
    }
}

