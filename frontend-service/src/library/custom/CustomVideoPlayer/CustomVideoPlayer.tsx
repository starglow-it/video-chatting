import React, { memo, useEffect } from 'react';
import videojs from 'video.js';
import clsx from 'clsx';

// types
import { CustomVideoPlayerProps } from '@library/custom/CustomVideoPlayer/types';

const Component = ({ options, className }: CustomVideoPlayerProps) => {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);

    useEffect(() => {
        if (!options.sources) {
            return;
        }

        if (!playerRef.current) {
            const videoElement = videoRef.current;
            if (!videoElement) return;

            // eslint-disable-next-line no-multi-assign
            playerRef.current = videojs(videoElement, options, () => {
                videojs.log('player is ready');
            });
        } else {
            const player = playerRef.current;
            player.autoplay(options.autoplay);
            player.src(options.sources);
            player.load();
            player.play();
        }
    }, [options]);

    React.useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player className={className}>
            <video ref={videoRef} className={clsx('video-js', className)}>
                <source src={options.sources?.[0]?.src} type={options.sources?.[0]?.type} />
            </video>
        </div>
    );
};

export const CustomVideoPlayer = memo(Component);
