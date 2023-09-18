import React, { useRef, memo, useEffect } from 'react';

// types
import { CustomVideoPlayerProps } from './types';

import styles from './CustomVideoPlayer.module.scss';

const Component = ({ isMuted, volume, src }: CustomVideoPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (video) {
            video.muted = isMuted;
        }
    }, [isMuted]);

    useEffect(() => {
        const video = videoRef.current;

        if (video && !Number.isNaN(volume)) {
            video.volume = volume / 100;
        }
    }, [volume]);

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
        <video
            ref={videoRef}
            className={styles.video}
            autoPlay
            loop
            playsInline
        />
    );
};

const CustomVideoPlayer = memo(Component);

export default CustomVideoPlayer;
