import React, { useRef, memo, useEffect } from 'react';
import clsx from 'clsx';

// types
import { CustomVideoPlayerProps } from './types';

import styles from './CustomVideoPlayer.module.scss';

const Component = ({ isPlaying, isMuted, volume, src, className }: CustomVideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (video) {
            video.muted = isMuted;
        }
    }, [isMuted]);

    useEffect(() => {
        const video = videoRef.current;

        if (video && !isNaN(volume)) {
            video.volume = volume / 100;
        }
    }, [volume]);

    useEffect(() => {
        const video = videoRef.current;

        if (video) {
            if (isPlaying) {
                video.play();
            } else {
                video.pause();
            }
        }
    }, [isPlaying]);

    useEffect(
        () => () => {
            videoRef.current = null;
        },
        [],
    );

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.src = src;
        }
    }, [src]);

    return (
        <div className={className}>
            <video
                ref={videoRef}
                className={clsx(styles.video, className)}
                autoPlay
                loop
                playsInline
            />
        </div>
    );
};

const CustomVideoPlayer = memo(Component);

export default CustomVideoPlayer;
