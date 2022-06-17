import React, { memo, useEffect, useLayoutEffect, useRef } from 'react';
import VimeoPlayer, { Player, Options } from '@vimeo/player';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// styles
import styles from './MeetingBackgroundVideo.module.scss';

// types
import { MeetingBackgroundVideoProps } from './types';

// stores
import { $backgroundAudioVolume, $isBackgroundAudioActive } from '../../../store/other';

const MeetingBackgroundVideo = memo(
    ({ children, src, isScreenSharing }: MeetingBackgroundVideoProps) => {
        const playerRef = useRef<Player | null>(null);
        const containerRef = useRef<HTMLDivElement | null>(null);

        const isAudioBackgroundActive = useStore($isBackgroundAudioActive);
        const backgroundAudioVolume = useStore($backgroundAudioVolume);

        useLayoutEffect(() => {
            const options = {
                url: src,
                responsive: true,
                loop: true,
                background: true,
                keyboard: false,
                quality: '1080p',
            } as Options;

            if (containerRef.current) {
                playerRef.current = new VimeoPlayer(containerRef.current!, options);
            }
        }, []);

        useEffect(() => {
            (async () => {
                await playerRef?.current?.setMuted?.(!isAudioBackgroundActive);
                await playerRef?.current?.setVolume?.(
                    isAudioBackgroundActive ? backgroundAudioVolume / 100 : 0,
                );
            })();
        }, [isAudioBackgroundActive, backgroundAudioVolume]);

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
            >
                {children!}
            </CustomGrid>
        );
    },
);

export { MeetingBackgroundVideo };
