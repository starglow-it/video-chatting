import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { getDevices, getDevicesFromStream } from '../helpers/media/getDevices';
import { getMediaStream } from '../helpers/media/getMediaStream';
import { DeviceInputKindEnum } from '../const/media/DEVICE_KINDS';
import { stopStream } from '../helpers/media/stopStream';

type MediaContextType = {
    data: {
        changeStream: MediaStream | null;
        activeStream: MediaStream | null;
        error: string;
        videoDevices: MediaDeviceInfo[];
        audioDevices: MediaDeviceInfo[];
        isMicActive: boolean;
        isCameraActive: boolean;
        currentAudioDevice: MediaDeviceInfo['deviceId'];
        currentVideoDevice: MediaDeviceInfo['deviceId'];
        isStreamRequested: boolean;
    };
    actions: {
        onToggleCamera: (isEnabled?: boolean) => void;
        onToggleMic: (isEnabled?: boolean) => void;
        onChangeStream:
            | (({ kind, deviceId }: ChangeMediaStreamData) => Promise<void>)
            | (() => void);
        onChangeActiveStream: () => MediaStream | null;
        onInitDevices: () => Promise<void>;
    };
};

type UseMediaDevices = {
    audioDevices: MediaDeviceInfo[];
    videoDevices: MediaDeviceInfo[];
};

type ChangeMediaStreamData = {
    kind: DeviceInputKindEnum;
    deviceId: MediaDeviceInfo['deviceId'];
};

export const MediaContext = React.createContext<MediaContextType>({
    data: {
        error: '',
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
        onChangeStream: () => {},
        onChangeActiveStream: () => null,
        onInitDevices: async () => {},
        onToggleCamera: () => {},
        onToggleMic: () => {},
    },
});

export const MediaContextProvider = ({ children }: React.PropsWithChildren<any>): ReactElement => {
    const [audioDevices, setAudioDevices] = useState<UseMediaDevices['audioDevices']>([]);
    const [videoDevices, setVideoDevices] = useState<UseMediaDevices['videoDevices']>([]);
    const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
    const [isMicActive, setIsMicActive] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
    const [changeStream, setChangeStream] = useState<MediaStream | null>(null);
    const [currentAudioDevice, setCurrentAudioDevice] = useState('');
    const [currentVideoDevice, setCurrentVideoDevice] = useState('');
    const [isStreamRequested, setIsStreamRequested] = useState(false);

    const handleGetInitialStream = useCallback(async () => {
        setIsStreamRequested(true);

        const { stream: initialStream, error: initialError } = await getMediaStream({
            audioDeviceId: currentAudioDevice,
            videoDeviceId: currentVideoDevice,
        });

        if (initialError) {
            setError(initialError);
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

            const { stream, error } = await getMediaStream({
                audioDeviceId: audioDevice?.deviceId,
                videoDeviceId: videoDevice?.deviceId,
            });

            if (stream) {
                setChangeStream(prev => {
                    stopStream(prev);

                    return stream;
                });
                setError('');

                if (audio.length) {
                    setAudioDevices(audio);
                }

                if (video.length) {
                    setVideoDevices(video);
                }
            }

            if (error) {
                setError(error);
                setChangeStream(prev => {
                    stopStream(prev);

                    return null;
                });
            }

            setIsStreamRequested(false);
        }
    }, [currentAudioDevice, currentVideoDevice]);

    useEffect(() => {
        return () => {
            stopStream(activeStream);
        };
    }, [activeStream]);

    useEffect(() => {
        return () => {
            stopStream(changeStream);
        };
    }, [changeStream]);

    useEffect(() => {
        handleGetInitialStream();

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

    useEffect(() => {
        if (!changeStream) {
            setIsCameraActive(false);
            setIsMicActive(false);
        } else if (changeStream) {
            const videoTrack = changeStream.getVideoTracks()[0];
            const audioTrack = changeStream.getAudioTracks()[0];

            setIsCameraActive(videoTrack.enabled);
            setIsMicActive(audioTrack.enabled);

            const { audioDeviceId, videoDeviceId } = getDevicesFromStream(changeStream);

            if (audioDeviceId) {
                setCurrentAudioDevice(audioDeviceId);
            }

            if (videoDeviceId) {
                setCurrentVideoDevice(videoDeviceId);
            }
        }
    }, [changeStream]);

    const handleChangeActiveStream = useCallback(() => {
        const newStream = changeStream?.clone();

        if (newStream) {
            setActiveStream(prev => {
                stopStream(prev);

                return newStream;
            });

            stopStream(changeStream);

            return newStream;
        }
        return null;
    }, [changeStream]);

    const handleChangeStream = useCallback(
        async ({ kind, deviceId }: ChangeMediaStreamData) => {
            let newStream = null;

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
                    setChangeStream(newStream?.stream);
                    setError('');
                }

                if (newStream?.error) {
                    setError(newStream?.error);
                    setChangeStream(null);
                }
            }
        },
        [changeStream],
    );

    const handleToggleCamera = useCallback(
        isEnabled => {
            const videoTrack = changeStream?.getVideoTracks()[0];

            if (videoTrack) {
                const newState = isEnabled ?? !isCameraActive;
                setIsCameraActive(() => newState);
                videoTrack.enabled = newState;
            } else {
                handleGetInitialStream();
            }
        },
        [changeStream, isCameraActive],
    );

    const handleToggleMic = useCallback(
        isEnabled => {
            const audioTrack = changeStream?.getAudioTracks()[0];

            if (audioTrack) {
                const newState = isEnabled ?? !isMicActive;
                setIsMicActive(() => newState);
                audioTrack.enabled = newState;
            } else {
                handleGetInitialStream();
            }
        },
        [changeStream, isMicActive],
    );

    const contextValue = useMemo(() => {
        return {
            actions: {
                onToggleCamera: handleToggleCamera,
                onToggleMic: handleToggleMic,
                onChangeStream: handleChangeStream,
                onChangeActiveStream: handleChangeActiveStream,
                onInitDevices: handleGetInitialStream,
            },
            data: {
                changeStream,
                activeStream,
                error,
                videoDevices,
                audioDevices,
                isCameraActive,
                isMicActive,
                currentAudioDevice,
                currentVideoDevice,
                isStreamRequested,
            },
        };
    }, [
        handleToggleCamera,
        handleToggleMic,
        handleChangeStream,
        handleChangeActiveStream,
        handleGetInitialStream,
        changeStream,
        activeStream,
        error,
        isStreamRequested,
        videoDevices,
        audioDevices,
        isCameraActive,
        isMicActive,
        currentAudioDevice,
        currentVideoDevice,
    ]);

    return <MediaContext.Provider value={contextValue}>{children}</MediaContext.Provider>;
};
