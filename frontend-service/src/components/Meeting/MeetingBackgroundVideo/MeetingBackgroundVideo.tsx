import React, { memo, useEffect, useLayoutEffect, useRef } from 'react';
import VimeoPlayer, { Player, Options } from '@vimeo/player';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// styles
import { MeetingBackgroundVideoProps } from '@components/Meeting/MeetingBackgroundVideo/types';
import styles from './MeetingBackgroundVideo.module.scss';

// types

const MeetingBackgroundVideo = memo(
    ({ children, src, isScreenSharing }: MeetingBackgroundVideoProps) => {
        const playerRef = useRef<Player | null>(null);
        const containerRef = useRef<HTMLDivElement | null>(null);

        useLayoutEffect(() => {
            const options = {
                url: src,
                width: window.innerWidth,
                loop: true,
                background: true,
                quality: '1080p',
            } as Options;

            if (containerRef.current)
                playerRef.current = new VimeoPlayer(containerRef.current!, options);
        }, []);

        useEffect(() => {
            if (playerRef.current) {
                if (isScreenSharing) {
                    playerRef.current?.pause();
                } else {
                    playerRef.current?.play();
                }
            }
        }, [isScreenSharing]);

        return (
            <CustomGrid
                ref={containerRef}
                className={styles.backgroundVideo}
                container
                justifyContent="center"
                alignItems="center"
            >
                {children!}
            </CustomGrid>
        );
    },
);

export { MeetingBackgroundVideo };
