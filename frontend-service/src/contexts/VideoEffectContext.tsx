import React, { useEffect, ReactElement, useCallback, useMemo, useRef } from 'react';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// helpers
import { addBlur } from '../helpers/media/addBlur';
import { StorageKeysEnum, WebStorage } from '../controllers/WebStorageController';

const resultWidth = 240;

export const VideoEffectsContext = React.createContext({
    data: {
        isBlurActive: true,
    },
    actions: {
        onGetCanvasStream: async (
            stream: MediaStream,
            options: { isBlurActive: boolean },
        ): Promise<MediaStream> => stream,
        onToggleBlur: () => {},
        onSetBlur: (value: boolean) => {},
    },
});

const blurFn = addBlur('/images/orange.png');

export const VideoEffectsProvider = ({ children }: React.PropsWithChildren<any>): ReactElement => {
    const savedSettings = WebStorage.get<{ blurSetting: boolean }>({
        key: StorageKeysEnum.meetingSettings,
    });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const {
        value: isBlurActive,
        onToggleSwitch: handleToggleBlur,
        onSetSwitch: handleSetBlur,
    } = useToggle(savedSettings?.blurSetting ?? true);

    const handleGetActiveStream = useCallback(
        async (stream: MediaStream, options) => {
            const newBlurSetting = options?.isBlurActive ?? isBlurActive;

            let videoTrack = stream.getVideoTracks()[0];

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
