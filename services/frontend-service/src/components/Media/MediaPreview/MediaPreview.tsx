import { memo, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// components
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';
import { VolumeAnalyzer } from '@components/Media/VolumeAnalyzer/VolumeAnalyzer';

// types
import { MediaPreviewProps } from './types';

// styles
import styles from './MediaPreview.module.scss';

const Component = ({
    videoError,
    audioError,
    videoDevices,
    audioDevices,
    isCameraActive,
    stream,
    onToggleVideo,
    profileAvatar,
    userName,
}: MediaPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        (async () => {
            if (stream && videoRef?.current) {
                videoRef.current.srcObject = stream;
            }
        })();
    }, [stream]);

    const { isMobile } = useBrowserDetect();

    const handleToggleVideo = useCallback(() => {
        onToggleVideo?.();
    }, [onToggleVideo]);

    const isNeedToRenderDevices =
        (Boolean(videoDevices.length || audioDevices.length) && !audioError) ||
        (!(videoDevices.length || audioDevices.length) && audioError);

    const isVideoDisabled = !stream?.id || Boolean(videoError);

    return (
        <CustomGrid
            container
            direction={isMobile ? 'row' : 'column'}
            wrap="nowrap"
            className={clsx(styles.previewWrapper, {
                [styles.mobile]: isMobile,
            })}
        >
            <RoundedVideo
                isLocal
                isCameraActive={isCameraActive}
                isVideoAvailable={!isVideoDisabled}
                userName={userName}
                userProfilePhoto={profileAvatar}
                videoRef={videoRef}
                size={isMobile ? 99 : 116}
                className={styles.previewVideo}
                onToggleVideo={handleToggleVideo}
            />
            {isNeedToRenderDevices && (
                <CustomGrid
                    container
                    direction="column"
                    className={styles.mediaWrapper}
                >
                    <VolumeAnalyzer
                        key={stream?.id}
                        indicatorsNumber={isMobile ? 9 : 6}
                    />
                </CustomGrid>
            )}
        </CustomGrid>
    );
};

export const MediaPreview = memo(Component);
