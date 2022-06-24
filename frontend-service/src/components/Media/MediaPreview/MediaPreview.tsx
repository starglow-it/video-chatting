import React, { memo, useCallback, useContext, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

// custom
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';
import { VolumeAnalyzer } from '@components/Media/VolumeAnalyzer/VolumeAnalyzer';

// library
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { MicIcon } from '@library/icons/MicIcon';
import { CameraIcon } from '@library/icons/CameraIcon';

// context
import { MediaContext } from '../../../contexts/MediaContext';

// stores
import { $profileStore } from '../../../store';
import { $localUserStore } from '../../../store';

// types
import { MediaPreviewProps } from './types';

// styles
import styles from './MediaPreview.module.scss';

const MediaPreview = memo(({ stream, onToggleAudio, onToggleVideo }: MediaPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement>();
    const profile = useStore($profileStore);
    const localUser = useStore($localUserStore);

    const {
        data: { error, videoDevices, audioDevices, isMicActive, isCameraActive },
        actions: { onToggleMic, onToggleCamera },
    } = useContext(MediaContext);

    useEffect(() => {
        (async () => {
            if (stream && videoRef?.current) {
                videoRef.current.srcObject = stream;
            }
        })();
    }, [stream]);

    const handleToggleVideo = useCallback(() => {
        onToggleVideo?.();
        onToggleCamera();
    }, [onToggleVideo]);

    const handleToggleAudio = useCallback(() => {
        onToggleAudio?.();
        onToggleMic();
    }, [onToggleAudio]);

    const isNeedToRenderDevices =
        (Boolean(videoDevices.length || audioDevices.length) && !error) ||
        (!(videoDevices.length || audioDevices.length) && error);

    return (
        <CustomGrid container direction="column" className={styles.previewWrapper}>
            <RoundedVideo
                isLocal
                isCameraActive={isCameraActive}
                userName={localUser?.username || ''}
                userProfilePhoto={profile.profileAvatar?.url || ''}
                videoRef={videoRef}
                size={116}
                className={styles.previewVideo}
            />
            {isNeedToRenderDevices && (
                <>
                    <VolumeAnalyzer key={stream?.id} />
                    <CustomGrid container className={styles.controlsWrapper}>
                        <CustomTooltip nameSpace="errors" translation={error}>
                            <ActionButton
                                className={clsx(styles.controlBtn, {
                                    [styles.withError]: Boolean(error),
                                })}
                                onAction={handleToggleAudio}
                                Icon={<MicIcon width="32px" height="32px" isActive={isMicActive} />}
                            />
                        </CustomTooltip>
                        <CustomTooltip nameSpace="errors" translation={error}>
                            <ActionButton
                                className={clsx(styles.controlBtn, {
                                    [styles.withError]: Boolean(error),
                                })}
                                onAction={handleToggleVideo}
                                Icon={
                                    <CameraIcon
                                        width="32px"
                                        height="32px"
                                        isActive={isCameraActive}
                                    />
                                }
                            />
                        </CustomTooltip>
                    </CustomGrid>
                </>
            )}
        </CustomGrid>
    );
});

export { MediaPreview };
