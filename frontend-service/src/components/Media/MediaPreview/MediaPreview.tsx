import React, { memo, useContext, useEffect, useRef } from 'react';
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

import { MediaContext } from '../../../contexts/MediaContext';

// stores
import { $profileStore } from '../../../store/profile';
import { $localUserStore } from '../../../store/users';

import { MediaPreviewProps } from './types';

import styles from './MediaPreview.module.scss';

const MediaPreview = memo(({ onToggleAudio, onToggleVideo }: MediaPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement>();
    const profile = useStore($profileStore);
    const localUser = useStore($localUserStore);

    const {
        data: { changeStream, error, videoDevices, audioDevices, isMicActive, isCameraActive },
        actions: { onToggleMic, onToggleCamera },
    } = useContext(MediaContext);

    useEffect(() => {
        if (changeStream && videoRef?.current) {
            videoRef.current.srcObject = changeStream;
        }
    }, [changeStream]);

    const handleToggleVideo = () => {
        onToggleVideo?.();
        onToggleCamera();
    };

    const handleToggleAudio = () => {
        onToggleAudio?.();
        onToggleMic();
    };

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
                    <VolumeAnalyzer key={changeStream?.id} />
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
