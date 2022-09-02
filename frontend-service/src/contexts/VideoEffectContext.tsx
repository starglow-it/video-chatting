import React, { useEffect, ReactElement, useCallback, useMemo, useRef } from 'react';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// helpers
import { addBlur } from '../helpers/media/addBlur';
import { StorageKeysEnum, WebStorage } from '../controllers/WebStorageController';
import { CustomMediaStream, SavedSettings } from '../types';
import { emptyFunction } from '../utils/functions/emptyFunction';

const resultWidth = 240;

export const VideoEffectsContext = React.createContext<{
    data: { isBlurActive: boolean };
    actions: {
        onGetCanvasStream: (
            stream: CustomMediaStream,
            options?: { isBlurActive: boolean },
        ) => Promise<CustomMediaStream | void>;
        onToggleBlur: (() => void) | typeof emptyFunction;
        onSetBlur: ((value: boolean) => void) | typeof emptyFunction;
    };
}>({
    data: {
        isBlurActive: true,
    },
    actions: {
        onGetCanvasStream: async (stream: CustomMediaStream) => stream,
        onToggleBlur: emptyFunction,
        onSetBlur: emptyFunction,
    },
});

const blurFn = addBlur('/images/orange.png');

export const VideoEffectsProvider = ({ children }: React.PropsWithChildren): ReactElement => {
    const savedSettings = WebStorage.get<SavedSettings>({
        key: StorageKeysEnum.meetingSettings,
    });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const { isMobile } = useBrowserDetect();

    const {
        value: isBlurActive,
        onToggleSwitch: handleToggleBlur,
        onSetSwitch: handleSetBlur,
    } = useToggle(savedSettings?.blurSetting ?? !isMobile);

    const handleGetActiveStream = useCallback(
        async (stream: CustomMediaStream, options?: { isBlurActive: boolean }) => {
            if (stream) {
                const newBlurSetting = options?.isBlurActive ?? isBlurActive;

                let videoTrack = stream?.getVideoTracks()[0];

                if (videoTrack) {
                    const temEnabled = videoTrack.enabled;

                    videoTrack.enabled = true;

                    if (newBlurSetting) {
                        videoTrack = await blurFn.start(videoTrack);
                    }

                    const track = stream.getVideoTracks()[0];

                    stream.removeTrack(track);

                    stream.addTrack(videoTrack);

                    videoTrack.enabled = temEnabled;
                }

                return stream;
            }
        },
        [isBlurActive],
    );

    useEffect(
        () => () => {
            blurFn.destroy();
        },
        [],
    );

    const contextValue = useMemo(
        () => ({
            actions: {
                onGetCanvasStream: handleGetActiveStream,
                onToggleBlur: handleToggleBlur,
                onSetBlur: handleSetBlur,
            },
            data: {
                isBlurActive,
            },
        }),
        [isBlurActive, handleGetActiveStream],
    );

    return (
        <VideoEffectsContext.Provider value={contextValue}>
            <CustomGrid
                sx={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    zIndex: -1,
                    visibility: 'hidden',
                }}
            >
                <video ref={videoRef} autoPlay playsInline muted />
                <canvas ref={canvasRef} width={resultWidth} height={resultWidth} />
            </CustomGrid>
            {children}
        </VideoEffectsContext.Provider>
    );
};
