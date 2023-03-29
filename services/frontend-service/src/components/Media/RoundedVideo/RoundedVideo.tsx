import React, { memo, useCallback, useMemo, useState } from 'react';
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
    isVideoSelfView = false
}: RoundedVideoProps) => {
    const [isVideoActive, setIsVideoActive] = useState(false);



    const handleVideoLoaded = useCallback(() => {
        setIsVideoActive(true);
    }, []);

    const style = useMemo(
        () => ({ '--sizeCoef': size / 150 } as React.CSSProperties),
        [size],
    );

    console.log(videoRef)

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
                    <VideoEyeIcon
                        width={isScreenSharing ? '30px' : '40px'}
                        height={isScreenSharing ? '30px' : '40px'}
                        isActive={
                            !isSelfView ? isCameraActive : isVideoSelfView
                        }
                    />
                    <ConditionalRender
                        condition={!isScreenSharing && size > 84}
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
            <video
                onLoadedData={handleVideoLoaded}
                ref={videoRef}
                className={clsx(styles.video, { [styles.mirror]: isLocal })}
                style={style}
                playsInline
                muted
                autoPlay
            />
        </CustomGrid>
    );
};

export const RoundedVideo = memo(Component);
