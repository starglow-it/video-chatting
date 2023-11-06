import { useEffect, useRef } from 'react';
import { PropsWithClassName } from 'shared-frontend/types';
import YouTube from 'react-youtube';

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

    function getYouTubeVideoId(videoUrl: string) {
        try {
            if (!videoUrl) return null;
            const parsedUrl = new URL(videoUrl);
            if (
                parsedUrl.hostname === 'www.youtube.com' ||
                parsedUrl.hostname === 'youtube.com'
            ) {
                return parsedUrl.searchParams.get('v');
            }
            if (parsedUrl.hostname === 'youtu.be') {
                return parsedUrl.pathname.substr(1);
            }
        } catch (error) {
            console.error(error);
        }
        return null;
    }

    const yId = getYouTubeVideoId(url);

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
