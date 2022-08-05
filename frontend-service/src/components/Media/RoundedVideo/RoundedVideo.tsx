import React, { memo, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// avatar
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// styles
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { VideoEyeIcon } from '@library/icons/VideoEyeIcon';

// styles
import styles from './RoundedVideo.module.scss';

// types
import { RoundedVideoProps } from './types';

const RoundedVideo = memo(
    ({
        userName,
        userProfilePhoto,
        className,
        size,
        isCameraActive,
        isLocal,
        videoRef,
        onToggleVideo,
        isScreenSharing,
    }: RoundedVideoProps) => {
        const [isVideoActive, setIsVideoActive] = useState(false);

        const handleVideoLoaded = useCallback(() => {
            setIsVideoActive(true);
        }, []);

        const style = useMemo(() => ({ '--sizeCoef': size / 120 } as React.CSSProperties), [size]);

        return (
            <CustomGrid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ width: `${size}px`, height: `${size}px` }}
                className={clsx(styles.videoWrapper, className)}
            >
                {!(isCameraActive && isVideoActive) && (
                    <ProfileAvatar
                        src={userProfilePhoto}
                        className={styles.avatarOverlay}
                        width={`${size}px`}
                        height={`${size}px`}
                        userName={userName}
                    />
                )}
                {isLocal
                    ? (
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
                                isActive={isCameraActive}
                            />
                            {!isScreenSharing && size > 84
                                ? (
                                    <CustomTypography
                                        variant="body3"
                                        nameSpace="meeting"
                                        translation={
                                            isCameraActive ? 'devices.switchOff' : 'devices.switchOn'
                                        }
                                    />
                                )
                                : null
                            }
                        </CustomGrid>
                    )
                    : null
                }
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
    },
);

export { RoundedVideo };
