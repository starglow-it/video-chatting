import { useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

import styles from './CustomYoutubePlayer.module.scss';
import { PropsWithClassName } from 'types';
import { getYoutubeId } from 'shared-utils';

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
        isMute ? setVolume(0) : setVolume(volume);
    }, [isMute]);

    useEffect(() => {
        setVolume(volume);
    }, [volume]);

    if (!yId) return null;

    const onReady = (event: any) => {
        if (event?.target) {
            event.target.playVideo();
            event.target.setVolume(isMute ? 0 : volume);
            playerRef.current = event.target;
        }
    };

    return (
        <YouTube
            videoId={yId ?? ''}
            iframeClassName={styles.fullPlayer}
            className={className}
            opts={{
                width: 1920,
                height: 1280,
                playerVars: {
                    autoplay: 1,
                    playsinline: 1,
                    controls: 0,
                    origin: '*',
                    loop: 1,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    fs: 1,
                },
            }}
            onReady={onReady}
        />
    );
};
