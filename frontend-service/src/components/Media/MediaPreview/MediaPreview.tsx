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
import { $profileStore, $localUserStore } from '../../../store';

// types
import { MediaPreviewProps } from './types';

// styles
import styles from './MediaPreview.module.scss';

const MediaPreview = memo(({ stream, onToggleAudio, onToggleVideo }: MediaPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement>();
    const profile = useStore($profileStore);
    const localUser = useStore($localUserStore);

    const {
        data: { videoDevices, audioDevices, isMicActive, isCameraActive, videoError, audioError },
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
        onToggleCamera(!isCameraActive);
    }, [onToggleCamera, onToggleVideo, isCameraActive]);

    const handleToggleAudio = useCallback(() => {
        onToggleAudio?.();
        onToggleMic(!isMicActive);
    }, [onToggleCamera, onToggleAudio, isMicActive]);

    const isNeedToRenderDevices =
        (Boolean(videoDevices.length || audioDevices.length) && !audioError) ||
        (!(videoDevices.length || audioDevices.length) && audioError);

    const isVideoDisabled = !stream?.id || Boolean(videoError);
    const isAudioDisabled = !stream?.id || Boolean(audioError);

    return (
        <CustomGrid container direction="column" className={styles.previewWrapper}>
            <RoundedVideo
                isLocal
                isCameraActive={isCameraActive}
                isVideoAvailable={!isVideoDisabled}
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
                        <CustomTooltip nameSpace="errors" translation={audioError}>
                            <ActionButton
                                className={clsx(styles.controlBtn, {
                                    [styles.withError]: Boolean(audioError),
                                    [styles.disabled]: isAudioDisabled,
                                })}
                                disabled={isAudioDisabled}
                                onAction={handleToggleAudio}
                                Icon={<MicIcon width="32px" height="32px" isActive={isMicActive} />}
                            />
                        </CustomTooltip>
                        <CustomTooltip nameSpace="errors" translation={videoError}>
                            <ActionButton
                                className={clsx(styles.controlBtn, {
                                    [styles.withError]: Boolean(videoError),
                                    [styles.disabled]: isVideoDisabled,
                                })}
                                onAction={handleToggleVideo}
                                disabled={isVideoDisabled}
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
