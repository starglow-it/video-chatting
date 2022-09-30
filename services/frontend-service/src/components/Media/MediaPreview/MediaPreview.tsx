import React, { memo, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

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

// stores
import { $profileStore } from '../../../store';
import {
    $audioDevicesStore,
    $audioErrorStore,
    $isCameraActiveStore,
    $isMicActiveStore,
    $localUserStore,
    $videoDevicesStore,
    $videoErrorStore,
    toggleDevicesEvent,
} from '../../../store/roomStores';

// types
import { MediaPreviewProps } from './types';

// styles
import styles from './MediaPreview.module.scss';

const Component = ({ stream, onToggleAudio, onToggleVideo }: MediaPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const profile = useStore($profileStore);
    const localUser = useStore($localUserStore);
    const videoDevices = useStore($videoDevicesStore);
    const audioDevices = useStore($audioDevicesStore);
    const isMicActive = useStore($isMicActiveStore);
    const isCameraActive = useStore($isCameraActiveStore);
    const videoError = useStore($videoErrorStore);
    const audioError = useStore($audioErrorStore);

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
        toggleDevicesEvent({
            isCamEnabled: !isCameraActive,
        });
    }, [isCameraActive]);

    const handleToggleAudio = useCallback(() => {
        onToggleAudio?.();
        toggleDevicesEvent({
            isMicEnabled: !isMicActive,
        });
    }, [isMicActive]);

    const isNeedToRenderDevices =
        (Boolean(videoDevices.length || audioDevices.length) && !audioError) ||
        (!(videoDevices.length || audioDevices.length) && audioError);

    const isVideoDisabled = !stream?.id || Boolean(videoError);
    const isAudioDisabled = !stream?.id || Boolean(audioError);

    const buttonsSize = isMobile ? '22px' : '32px';

    return (
        <CustomGrid
            container
            direction={isMobile ? 'row' : 'column'}
            wrap="nowrap"
            className={clsx(styles.previewWrapper, { [styles.mobile]: isMobile })}
        >
            <RoundedVideo
                isLocal
                isCameraActive={isCameraActive}
                isVideoAvailable={!isVideoDisabled}
                userName={localUser?.username || ''}
                userProfilePhoto={profile.profileAvatar?.url || ''}
                videoRef={videoRef}
                size={isMobile ? 99 : 116}
                className={styles.previewVideo}
                onToggleVideo={handleToggleVideo}
            />
            {isNeedToRenderDevices && (
                <CustomGrid container direction="column" className={styles.mediaWrapper}>
                    <VolumeAnalyzer key={stream?.id} indicatorsNumber={isMobile ? 9 : 6} />
                    <CustomGrid container className={styles.controlsWrapper}>
                        <CustomTooltip nameSpace="errors" translation={audioError}>
                            <ActionButton
                                className={clsx(styles.controlBtn, {
                                    [styles.withError]: Boolean(audioError),
                                    [styles.disabled]: isAudioDisabled,
                                    [styles.mobile]: isMobile,
                                })}
                                disabled={isAudioDisabled}
                                onAction={handleToggleAudio}
                                Icon={
                                    <MicIcon
                                        width={buttonsSize}
                                        height={buttonsSize}
                                        isActive={isMicActive}
                                    />
                                }
                            />
                        </CustomTooltip>
                        <CustomTooltip nameSpace="errors" translation={videoError}>
                            <ActionButton
                                className={clsx(styles.controlBtn, {
                                    [styles.withError]: Boolean(videoError),
                                    [styles.disabled]: isVideoDisabled,
                                    [styles.mobile]: isMobile,
                                })}
                                onAction={handleToggleVideo}
                                disabled={isVideoDisabled}
                                Icon={
                                    <CameraIcon
                                        width={buttonsSize}
                                        height={buttonsSize}
                                        isActive={isCameraActive}
                                    />
                                }
                            />
                        </CustomTooltip>
                    </CustomGrid>
                </CustomGrid>
            )}
        </CustomGrid>
    );
};

export const MediaPreview = memo(Component);
