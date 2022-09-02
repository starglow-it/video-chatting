import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { getDevices, getDevicesFromStream } from '../helpers/media/getDevices';
import { GetMediaStream, getMediaStream } from '../helpers/media/getMediaStream';
import { DeviceInputKindEnum } from '../const/media/DEVICE_KINDS';
import { stopStream } from '../helpers/media/stopStream';
import { StorageKeysEnum, WebStorage } from '../controllers/WebStorageController';
import { CustomMediaStream, SavedSettings } from '../types';
import { emptyFunction } from '../utils/functions/emptyFunction';

type ChangeMediaStreamData = {
    kind: DeviceInputKindEnum;
    deviceId: MediaDeviceInfo['deviceId'];
};

type MediaContextType = {
    data: {
        changeStream: CustomMediaStream;
        activeStream: CustomMediaStream;
        audioError: string | undefined;
        videoError: string | undefined;
        videoDevices: MediaDeviceInfo[];
        audioDevices: MediaDeviceInfo[];
        isMicActive: boolean;
        isCameraActive: boolean;
        currentAudioDevice: MediaDeviceInfo['deviceId'];
        currentVideoDevice: MediaDeviceInfo['deviceId'];
        isStreamRequested: boolean;
    };
    actions: {
        onToggleCamera: ((isEnabled?: boolean) => Promise<void>) | typeof emptyFunction;
        onToggleMic: ((isEnabled?: boolean) => Promise<void>) | typeof emptyFunction;
        onChangeStream:
            | (({ kind, deviceId }: ChangeMediaStreamData) => Promise<void>)
            | typeof emptyFunction;
        onChangeActiveStream: () => CustomMediaStream;
        onGetNewStream: (() => Promise<CustomMediaStream>) | typeof emptyFunction;
        onInitDevices: (() => Promise<void>) | typeof emptyFunction;
        onClearCurrentDevices: (() => void) | typeof emptyFunction;
    };
};

type UseMediaDevices = {
    audioDevices: MediaDeviceInfo[];
    videoDevices: MediaDeviceInfo[];
};

export const MediaContext = React.createContext<MediaContextType>({
    data: {
        videoError: '',
        audioError: '',
        changeStream: null,
        activeStream: null,
        videoDevices: [],
        audioDevices: [],
        isMicActive: false,
        isCameraActive: false,
        currentAudioDevice: '',
        currentVideoDevice: '',
        isStreamRequested: false,
    },
    actions: {
        onChangeStream: emptyFunction,
        onGetNewStream: async () => null,
        onChangeActiveStream: () => null,
        onInitDevices: emptyFunction,
        onToggleCamera: emptyFunction,
        onToggleMic: emptyFunction,
        onClearCurrentDevices: emptyFunction,
    },
});

export const MediaContextProvider = ({ children }: React.PropsWithChildren): ReactElement => {
    const [audioDevices, setAudioDevices] = useState<UseMediaDevices['audioDevices']>([]);
    const [videoDevices, setVideoDevices] = useState<UseMediaDevices['videoDevices']>([]);
    const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
    const [isMicActive, setIsMicActive] = useState<boolean>(true);
    const [audioError, setAudioError] = useState<string | undefined>('');
    const [videoError, setVideoError] = useState<string | undefined>('');
    const [activeStream, setActiveStream] = useState<CustomMediaStream>(null);
    const [changeStream, setChangeStream] = useState<CustomMediaStream>(null);

    const [currentAudioDevice, setCurrentAudioDevice] = useState('');
    const [currentVideoDevice, setCurrentVideoDevice] = useState('');

    const [isStreamRequested, setIsStreamRequested] = useState(false);

    const handleGetInitialStream = useCallback(async () => {
        setIsStreamRequested(true);
        setChangeStream(prev => {
            stopStream(prev);

            return null;
        });

        const savedSettings = WebStorage.get<SavedSettings>({
            key: StorageKeysEnum.meetingSettings,
        });

        const {
            stream: initialStream,
            audioError: initialAudioError,
            videoError: initialVideoError,
        } = await getMediaStream({
            audioDeviceId: savedSettings.savedAudioDeviceId || currentAudioDevice,
            videoDeviceId: savedSettings.savedVideoDeviceId || currentVideoDevice,
        });

        setAudioError(initialAudioError);
        setVideoError(initialVideoError);

        if (initialAudioError && initialVideoError) {
            setIsStreamRequested(false);
            return;
        }

        if (initialStream) {
            const { audioDeviceId, videoDeviceId } = getDevicesFromStream(initialStream);

            stopStream(initialStream);

            const { audio, video } = await getDevices();

            const videoDevice =
                video.find(device => device.deviceId === videoDeviceId) || video?.[0];
            const audioDevice =
                audio.find(device => device.deviceId === audioDeviceId) || audio?.[0];

            const {
                stream,
                audioError: newAudioError,
                videoError: newVideoError,
            } = await getMediaStream({
                audioDeviceId: audioDevice?.deviceId,
                videoDeviceId: videoDevice?.deviceId,
            });

            if (stream) {
                setChangeStream(prev => {
                    const { videoDeviceId: oldDevice } = getDevicesFromStream(prev);
                    const { videoDeviceId: newVideoDeviceId, audioDeviceId: newAudioDeviceId } =
                        getDevicesFromStream(stream);

                    if (oldDevice !== newVideoDeviceId || !prev || !prev?.active) {
                        stopStream(prev);

                        setIsCameraActive(isCameraActive);
                        setIsMicActive(isMicActive);

                        setCurrentAudioDevice(
                            prevAudioDeviceId => newAudioDeviceId || prevAudioDeviceId,
                        );
                        setCurrentVideoDevice(
                            prevVideoDeviceId => newVideoDeviceId || prevVideoDeviceId,
                        );

                        return stream;
                    }

                    stopStream(stream);

                    return prev;
                });
                setAudioError('');
                setVideoError('');

                if (audio.length) {
                    setAudioDevices(audio);
                }

                if (video.length) {
                    setVideoDevices(video);
                }
            }

            if (newAudioError || newVideoError) {
                setAudioError(newAudioError);
                setVideoError(newVideoError);
            }

            setIsStreamRequested(false);
        }
    }, [currentAudioDevice, currentVideoDevice, isCameraActive, isMicActive]);

    useEffect(() => {
        navigator.mediaDevices.ondevicechange = async () => {
            const { audio, video } = await getDevices();

            setAudioDevices(audio);
            setVideoDevices(video);
        };

        return () => {
            setActiveStream(stream => {
                stopStream(stream);
                return null;
            });
        };
    }, []);

    useEffect(
        () => () => {
            stopStream(activeStream);
        },
        [],
    );

    useEffect(
        () => () => {
            stopStream(changeStream);
        },
        [changeStream],
    );

    const handleChangeActiveStream = useCallback(() => {
        const newStream = changeStream?.clone();

        if (newStream) {
            setActiveStream(prev => {
                stopStream(prev);

                return newStream;
            });

            return newStream;
        }
        return null;
    }, [changeStream]);

    const handleChangeStream = useCallback(
        async ({ kind, deviceId }: ChangeMediaStreamData) => {
            let newStream: GetMediaStream = {};

            if (changeStream) {
                const { audioDeviceId, videoDeviceId } = getDevicesFromStream(changeStream);

                if (kind === DeviceInputKindEnum.VideoInput) {
                    newStream = await getMediaStream({
                        audioDeviceId,
                        videoDeviceId: deviceId,
                    });
                } else if (kind === DeviceInputKindEnum.AudioInput) {
                    newStream = await getMediaStream({
                        audioDeviceId: deviceId,
                        videoDeviceId,
                    });
                }

                stopStream(changeStream);

                if (newStream?.stream) {
                    setChangeStream(prev => {
                        const { videoDeviceId: oldVideoDevice, audioDeviceId: oldAudioDevice } =
                            getDevicesFromStream(prev);
                        const { videoDeviceId: newVideoDevice, audioDeviceId: newAudioDevice } =
                            getDevicesFromStream(newStream?.stream);

                        if (
                            oldVideoDevice !== newVideoDevice ||
                            oldAudioDevice !== newAudioDevice ||
                            !prev ||
                            !prev?.active
                        ) {
                            stopStream(prev);

                            setIsCameraActive(isCameraActive);
                            setIsMicActive(isMicActive);

                            setCurrentAudioDevice(prevDevice => newAudioDevice || prevDevice);
                            setCurrentVideoDevice(prevDevice => newVideoDevice || prevDevice);

                            return newStream?.stream;
                        }

                        stopStream(newStream?.stream);

                        return prev;
                    });
                    setAudioError('');
                    setVideoError('');
                }

                if (newStream?.error) {
                    setAudioError(newStream?.audioError);
                    setVideoError(newStream?.videoError);
                    setChangeStream(null);
                }
            }
        },
        [changeStream],
    );

    const handleToggleCamera = useCallback(
        async (isEnabled?: boolean) => {
            const videoTrack = changeStream?.getVideoTracks()[0];

            if (videoTrack) {
                const newState = isEnabled ?? !isCameraActive;

                setIsCameraActive(() => newState);
                videoTrack.enabled = newState;
            } else {
                await handleGetInitialStream();
            }
        },
        [changeStream, isCameraActive],
    );

    const handleToggleMic = useCallback(
        async (isEnabled?: boolean) => {
            const audioTrack = changeStream?.getAudioTracks()[0];

            if (audioTrack) {
                const newState = isEnabled ?? !isMicActive;
                setIsMicActive(() => newState);
                audioTrack.enabled = newState;
            } else {
                await handleGetInitialStream();
            }
        },
        [changeStream, isMicActive],
    );

    const handleGetNewStream = useCallback(async () => {
        const { stream } = await getMediaStream({
            audioDeviceId: currentAudioDevice,
            videoDeviceId: currentVideoDevice,
        });

        setChangeStream(prev => {
            stopStream(prev);

            return stream;
        });
        setVideoError('');
        setAudioError('');

        return stream;
    }, [currentAudioDevice, currentVideoDevice]);

    const handleClearCurrentDevices = () => {
        setCurrentAudioDevice('');
        setCurrentVideoDevice('');
        setChangeStream(null);
    };

    const contextValue = useMemo(
        () => ({
            actions: {
                onToggleCamera: handleToggleCamera,
                onToggleMic: handleToggleMic,
                onChangeStream: handleChangeStream,
                onChangeActiveStream: handleChangeActiveStream,
                onInitDevices: handleGetInitialStream,
                onGetNewStream: handleGetNewStream,
                onClearCurrentDevices: handleClearCurrentDevices,
            },
            data: {
                changeStream,
                activeStream,
                videoError,
                audioError,
                videoDevices,
                audioDevices,
                isCameraActive,
                isMicActive,
                currentAudioDevice,
                currentVideoDevice,
                isStreamRequested,
            },
        }),
        [
            handleToggleCamera,
            handleToggleMic,
            handleChangeStream,
            handleChangeActiveStream,
            handleGetInitialStream,
            handleGetNewStream,
            changeStream,
            activeStream,
            videoError,
            audioError,
            isStreamRequested,
            videoDevices,
            audioDevices,
            isCameraActive,
            isMicActive,
            currentAudioDevice,
            currentVideoDevice,
        ],
    );

    return <MediaContext.Provider value={contextValue}>{children}</MediaContext.Provider>;
};
