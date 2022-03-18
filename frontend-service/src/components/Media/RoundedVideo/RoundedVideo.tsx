import React, { memo, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// avatar
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

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
