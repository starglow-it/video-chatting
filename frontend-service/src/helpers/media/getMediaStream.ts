import { VIDEO_CONSTRAINTS } from '../../const/media/VIDEO_CONSTRAINTS';

import { MediaStreamOptions } from './types';

const MEDIA_STREAMS_ERROR = new Map([
    ['Permission denied', 'media.notAllowed'],
    ['Permission dismissed', 'media.notAllowed'],
]);

export const getVideoMediaStream = async (
    videoDeviceId: MediaStreamOptions['videoDeviceId'],
): Promise<{
    stream?: MediaStream | null;
    error?: string;
}> => {
    try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
                ...VIDEO_CONSTRAINTS,
                ...(videoDeviceId ? { deviceId: videoDeviceId } : {}),
            },
        });

        return { stream: videoStream };
    } catch (e: any) {
        console.log(e);
        return { error: MEDIA_STREAMS_ERROR.get(e.message) || e.message };
    }
};

export const getAudioMediaStream = async (
    audioDeviceId: MediaStreamOptions['audioDeviceId'],
): Promise<{
    stream?: MediaStream | null;
    error?: string;
}> => {
    try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: audioDeviceId ? { deviceId: audioDeviceId } : true,
        });

        return { stream: audioStream };
    } catch (e: any) {
        return { error: MEDIA_STREAMS_ERROR.get(e.message) || e.message };
    }
};

export const composeMediaStream = (streamOne, streamTwo) => {
    const newStream = new MediaStream();

    const audioTracks = [
        ...(streamOne ? streamOne.getTracks().filter(track => track.kind === 'audio') : []),
        ...(streamTwo ? streamTwo.getTracks().filter(track => track.kind === 'audio') : []),
    ];

    const videoTracks = [
        ...(streamOne ? streamOne.getTracks().filter(track => track.kind === 'video') : []),
        ...(streamTwo ? streamTwo.getTracks().filter(track => track.kind === 'video') : []),
    ];

    if (audioTracks.length) newStream.addTrack(audioTracks[0]);
    if (videoTracks.length) newStream.addTrack(videoTracks[0]);

    return newStream;
};

export const getMediaStream = async ({
    audioDeviceId,
    videoDeviceId,
}: MediaStreamOptions = {}): Promise<{
    stream?: MediaStream | null;
    audioError?: string;
    videoError?: string;
}> => {
    const { stream: videoStream, error: videoStreamError } = await getVideoMediaStream(
        videoDeviceId,
    );
    const { stream: audioStream, error: audioStreamError } = await getAudioMediaStream(
        audioDeviceId,
    );

    const stream = await composeMediaStream(videoStream, audioStream);

    return {
        stream,
        audioError: audioStreamError,
        videoError: videoStreamError,
    };
};
