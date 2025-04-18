import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { VideoEyeIcon } from 'shared-frontend/icons/OtherIcons/VideoEyeIcon';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// avatar
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// styles
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// styles
import styles from './RoundedVideo.module.scss';

// types
import { RoundedVideoProps } from './types';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

const Component = ({
    userName,
    userProfilePhoto,
    className,
    size,
    videoRef,
    onToggleVideo,
    isCameraActive = false,
    isVideoAvailable = false,
    isLocal = false,
    isScreenSharing = false,
    isSelfView = false,
    isVideoSelfView = false,
}: RoundedVideoProps) => {
    const [isVideoActive, setIsVideoActive] = useState(false);

    const {isMobile} = useBrowserDetect();

    const handleVideoLoaded = useCallback(() => {
        setIsVideoActive(true);
    }, []);

    const style = useMemo(
        () => ({ '--sizeCoef': size / 150 } as React.CSSProperties),
        [size],
    );
    return (
        <CustomGrid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ width: `${size}px`, height: `${size}px` }}
            className={clsx(styles.videoWrapper, className)}
        >
            {!(
                (!isSelfView ? isCameraActive : isVideoSelfView) &&
                isVideoActive &&
                isVideoAvailable
            ) && (
                    <ProfileAvatar
                        src={userProfilePhoto}
                        className={styles.avatarOverlay}
                        width={`${size}px`}
                        height={`${size}px`}
                        userName={userName}
                    />
                )}
            <ConditionalRender condition={isLocal && Boolean(onToggleVideo)}>
                <CustomGrid
                    container
                    direction="column"
                    className={styles.videoControlOverlay}
                    onClick={onToggleVideo}
                    justifyContent="center"
                    alignItems="center"
                >
                    <ConditionalRender condition={isSelfView && size > 105}>
                        <CustomTypography
                            variant="body3"
                            nameSpace="meeting"
                            align="center"
                            translation="devices.dragAndResize"
                        />
                    </ConditionalRender>
                    <VideoEyeIcon
                        width={isScreenSharing ? '30px' : '40px'}
                        height={isScreenSharing ? '30px' : '40px'}
                        isActive={
                            !isSelfView ? isCameraActive : isVideoSelfView
                        }
                    />
                    <ConditionalRender
                        condition={!isScreenSharing && size > 105}
                    >
                        <CustomTypography
                            variant="body3"
                            nameSpace="meeting"
                            align="center"
                            translation={
                                !isSelfView
                                    ? isCameraActive
                                        ? 'devices.switchOff'
                                        : 'devices.switchOn'
                                    : isVideoSelfView
                                        ? 'devices.selfViewOff'
                                        : 'devices.clickToSeeYourself'
                            }
                        />
                    </ConditionalRender>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={videoRef}>
                <video
                    onLoadedData={handleVideoLoaded}
                    ref={videoRef}
                    // className={clsx(styles.video, { [styles.mirror]: isLocal, [styles.zoomIn]: isMobile })}
                    className={clsx(styles.video, { [styles.mirror]: isLocal })}
                    style={style}
                    playsInline
                    muted={true}
                    autoPlay
                />
            </ConditionalRender>
        </CustomGrid>
    );
};

export const RoundedVideo = memo(Component);
