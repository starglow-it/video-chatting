import { isMobile } from 'shared-utils';
import { VIDEO_CONSTRAINTS } from '../../const/media/VIDEO_CONSTRAINTS';

import { MediaStreamOptions } from './types';
import { CustomMediaStream } from '../../types';

export const MEDIA_NOT_ALLOWED_BY_BROWSER = "notAllowedByBrowser";
export const MEDIA_NOT_ALLOWED_BY_SYSTEM = "notAllowedBySystem";
export const MEDIA_OPERATION_ABORTED = "operationAborted";
export const MEDIA_DEVICE_NOT_FOUND = "deviceNotFound";
export const MEDIA_DEVICE_NOT_ACCESSIBLE = "deviceNotAccessible";
export const MEDIA_CONSTRAINTS_CANNOT_BE_SATISFIED = "constraintsCannotBeSatisfied";
export const MEDIA_SECURITY_ERROR = "securityError";
export const MEDIA_INVALID_CONSTRAINTS = "invalidConstraints";
export const MEDIA_GENERAL_ERROR = "generalError";

export const MEDIA_STREAMS_ERROR = new Map<string, string | Map<string, string>>([
    [
        "NotAllowedError",
        new Map<string, string>([
            ["Permission denied", MEDIA_NOT_ALLOWED_BY_BROWSER],
            ["Permission denied by system", MEDIA_NOT_ALLOWED_BY_SYSTEM],
        ]),
    ],
    ["AbortError", MEDIA_OPERATION_ABORTED],
    ["NotFoundError", MEDIA_DEVICE_NOT_FOUND],
    ["NotReadableError", MEDIA_DEVICE_NOT_ACCESSIBLE],
    ["OverconstrainedError", MEDIA_CONSTRAINTS_CANNOT_BE_SATISFIED],
    ["SecurityError", MEDIA_SECURITY_ERROR],
    ["TypeError", MEDIA_INVALID_CONSTRAINTS],
]);


export type GetMediaStream = {
    stream?: MediaStream | null;
    audioError?: MediaStreamError;
    videoError?: MediaStreamError;
    error?: MediaStreamError;
};

export type MediaStreamError = {
    type: string;
    message?: string;
};

const getErrorType = (typedError: Error): MediaStreamError => {
    const errorInfo = MEDIA_STREAMS_ERROR.get(typedError.name);
    if (errorInfo instanceof Map) {
        const message = errorInfo.get(typedError.message) || MEDIA_NOT_ALLOWED_BY_BROWSER;
        return { type: message, message: typedError.message };
    }
    return {
        type: errorInfo || MEDIA_GENERAL_ERROR,
        message: typedError.message
    };
};

export const getVideoMediaStream = async (
    videoDeviceId: MediaStreamOptions['videoDeviceId'],
): Promise<{
    stream?: MediaStream | null;
    error?: MediaStreamError;
}> => {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('getUserMedia is not supported in this browser');
        }
        
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

        return {
            error: getErrorType(typedError)
        };
    }
};

export const getAudioMediaStream = async (
    audioDeviceId: MediaStreamOptions['audioDeviceId'],
): Promise<{
    stream?: MediaStream | null;
    error?: MediaStreamError;
}> => {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('getUserMedia is not supported in this browser');
        }

        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio:
                isMobile() || !audioDeviceId
                    ? true
                    : { deviceId: audioDeviceId },
        });

        return { stream: audioStream };
    } catch (e: unknown) {
        const typedError = e as Error;

        return {
            error: getErrorType(typedError)
        };
    }
};

export const composeMediaStream = (
    streamOne: CustomMediaStream,
    streamTwo: CustomMediaStream,
) => {
    const newStream = new MediaStream();

    const audioTracks = [
        ...(streamOne
            ? streamOne
                .getTracks()
                .filter((track: MediaStreamTrack) => track.kind === 'audio')
            : []),
        ...(streamTwo
            ? streamTwo
                .getTracks()
                .filter((track: MediaStreamTrack) => track.kind === 'audio')
            : []),
    ];

    const videoTracks = [
        ...(streamOne
            ? streamOne
                .getTracks()
                .filter((track: MediaStreamTrack) => track.kind === 'video')
            : []),
        ...(streamTwo
            ? streamTwo
                .getTracks()
                .filter((track: MediaStreamTrack) => track.kind === 'video')
            : []),
    ];

    if (audioTracks.length) newStream.addTrack(audioTracks[0]);
    if (videoTracks.length) newStream.addTrack(videoTracks[0]);

    return newStream;
};

export const getVideoAndAudioStream = async ({
    audioDeviceId,
    videoDeviceId,
}: MediaStreamOptions = {}) => {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('getUserMedia is not supported in this browser');
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({
            video: isMobile()
                ? {}
                : {
                    ...VIDEO_CONSTRAINTS,
                    ...(videoDeviceId ? { deviceId: videoDeviceId } : {}),
                },
            audio:
                isMobile() || !audioDeviceId
                    ? true
                    : { deviceId: audioDeviceId },
        });
        return { stream };
    } catch (e) {
        const typedError = e as Error;

        return {
            error: getErrorType(typedError)
        };
    }
};

export const getMediaStream = async ({
    audioDeviceId,
    videoDeviceId,
}: MediaStreamOptions = {}): Promise<GetMediaStream> => {
    let result: {
        stream?: MediaStream | null;
        error?: MediaStreamError;
    } = {};

    result = await getVideoAndAudioStream({audioDeviceId, videoDeviceId});
    const stream = result.stream || undefined;

    return {
        stream: stream || undefined, // Ensure stream is not null
        audioError: result.error,
        videoError: result.error,
    };
};