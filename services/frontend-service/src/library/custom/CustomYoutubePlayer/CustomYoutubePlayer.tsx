import { useEffect, useRef } from 'react';
import { PropsWithClassName } from 'shared-frontend/types';
import YouTube from 'react-youtube';

import { getYoutubeId } from 'shared-utils';
import styles from './CustomYoutubePlayer.module.scss';

export const CustomYoutubePlayer = ({
    url,
    className,
    volume,
    isMute = false,
}: PropsWithClassName<{
    url: string;
    className?: string;
    volume: number;
    isMute?: boolean;
}>) => {
    const playerRef = useRef<any>(null);
    const yId = getYoutubeId(url);

    const setVolume = (volumeData: number) => {
        if (playerRef.current) playerRef.current?.setVolume?.(volumeData);
    };

    useEffect(() => {
        if (playerRef.current) {
            if (isMute) {
                playerRef.current.mute();
            } else {
                playerRef.current.unMute();
            }
        }
    }, [isMute]);

    useEffect(() => {
        setVolume(volume);
    }, [volume]);

    if (!yId) return null;

    const onError = (event: any) => {
        console.log('#Duy Phan console error yb', event);
    };

    const onPause = (event: any) => {
        console.log('#Duy Phan console pause yb', event);
    };

    const onPlay = (event: any) => {
        console.log('#Duy Phan console', event);
    };

    const onReady = (event: any) => {
        playerRef.current = event.target;
        if (!isMute) {
            playerRef.current.unMute();
        }
    };

    return (
        <YouTube
            videoId={yId ?? ''}
            iframeClassName={styles.fullPlayer}
            className={className}
            opts={{
                width: '630',
                height: '340',
                playerVars: {
                    autoplay: 1,
                    playsinline: 1,
                    controls: 0,
                    origin: '*',
                    loop: 1,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    fs: 0,
                    allowfullscreen: 1,
                    mute: 1,
                },
            }}
            onPlay={onPlay}
            onReady={onReady}
            onError={onError}
            onPause={onPause}
        />
    );
};
