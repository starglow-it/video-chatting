import { CustomMediaStream } from '../../types';

export const getRecordingStream = async (): Promise<CustomMediaStream> => {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('getUserMedia is not supported in this browser');
        }
        
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: 30 },
            audio: true // This captures system audio if the browser supports it
        });

        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...micStream.getAudioTracks() // Combine the microphone audio track
        ]);

        return combinedStream;
    } catch (error) {
        console.error('Error capturing media:', error);
        throw error;
    }
};
