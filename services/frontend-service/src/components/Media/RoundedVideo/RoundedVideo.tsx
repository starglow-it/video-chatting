import React, { memo, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// avatar
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// styles
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { VideoEyeIcon } from 'shared-frontend/icons';

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
}: RoundedVideoProps) => {
    const [isVideoActive, setIsVideoActive] = useState(false);

    const handleVideoLoaded = useCallback(() => {
        setIsVideoActive(true);
    }, []);

    const style = useMemo(() => ({ '--sizeCoef': size / 150 } as React.CSSProperties), [size]);

    return (
        <CustomGrid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ width: `${size}px`, height: `${size}px` }}
            className={clsx(styles.videoWrapper, className)}
        >
            {!(isCameraActive && isVideoActive && isVideoAvailable) && (
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
                        isActive={isCameraActive}
                    />
                    <ConditionalRender condition={!isScreenSharing && size > 84}>
                        <CustomTypography
                            variant="body3"
                            nameSpace="meeting"
                            translation={isCameraActive ? 'devices.switchOff' : 'devices.switchOn'}
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
