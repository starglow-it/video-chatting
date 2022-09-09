import { VIDEO_CONSTRAINTS } from '../../const/media/VIDEO_CONSTRAINTS';

import { MediaStreamOptions } from './types';
import { CustomMediaStream } from '../../types';
import { isMobile } from '../../utils/browser/detectBrowser';

const MEDIA_STREAMS_ERROR = new Map([['NotAllowedError', 'media.notAllowed']]);

export type GetMediaStream = {
    stream?: MediaStream | null;
    audioError?: string;
    videoError?: string;
    error?: string;
};

export const getVideoMediaStream = async (
    videoDeviceId: MediaStreamOptions['videoDeviceId'],
): Promise<{
    stream?: MediaStream | null;
    error?: string;
}> => {
    try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
            video: isMobile()
                ? {}
                : {
                      ...VIDEO_CONSTRAINTS,
                      ...(videoDeviceId ? { deviceId: videoDeviceId } : {}),
                  },
        });

        return { stream: videoStream };
    } catch (e: unknown) {
        const typedError = e as Error;

        return { error: MEDIA_STREAMS_ERROR.get(typedError?.name) || typedError?.message };
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
            audio: isMobile() || !audioDeviceId ? true : { deviceId: audioDeviceId },
        });

        return { stream: audioStream };
    } catch (e: unknown) {
        const typedError = e as Error;

        return { error: MEDIA_STREAMS_ERROR.get(typedError?.name) || typedError?.message };
    }
};

export const composeMediaStream = (streamOne: CustomMediaStream, streamTwo: CustomMediaStream) => {
    const newStream = new MediaStream();

    const audioTracks = [
        ...(streamOne
            ? streamOne.getTracks().filter((track: MediaStreamTrack) => track.kind === 'audio')
            : []),
        ...(streamTwo
            ? streamTwo.getTracks().filter((track: MediaStreamTrack) => track.kind === 'audio')
            : []),
    ];

    const videoTracks = [
        ...(streamOne
            ? streamOne.getTracks().filter((track: MediaStreamTrack) => track.kind === 'video')
            : []),
        ...(streamTwo
            ? streamTwo.getTracks().filter((track: MediaStreamTrack) => track.kind === 'video')
            : []),
    ];

    if (audioTracks.length) newStream.addTrack(audioTracks[0]);
    if (videoTracks.length) newStream.addTrack(videoTracks[0]);

    return newStream;
};

export const getMediaStream = async ({
    audioDeviceId,
    videoDeviceId,
}: MediaStreamOptions = {}): Promise<GetMediaStream> => {
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
