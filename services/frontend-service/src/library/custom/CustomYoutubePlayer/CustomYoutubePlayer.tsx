import { useEffect, useRef } from 'react';
import YouTubePlayer from 'youtube-player';
import clsx from 'clsx';
import { PropsWithClassName } from 'shared-frontend/types';
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
    const videoRef = useRef<any>(null);
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
        playerRef.current?.setVolume(volumeData);
    };

    useEffect(() => {
        isMute ? setVolume(0) : setVolume(volume);
    }, [isMute]);

    useEffect(() => {
        playerRef.current && setVolume(volume);
    }, [volume]);

    useEffect(() => {
        try {
            if (yId) {
                playerRef.current = YouTubePlayer(videoRef.current, {
                    videoId: yId,
                    width: 1920,
                    height: 1280,
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        origin: '*',
                        loop: 1,
                        rel: 0,
                        showinfo: 0,
                        modestbranding: 1,
                        fs: 1,
                    },
                });

                playerRef.current.on('ready', () => {
                    playerRef.current?.playVideo();
                    playerRef.current?.setVolume(volume);
                });
            }
            return () => {
                playerRef.current?.destroy();
                playerRef.current = null;
            };
        } catch (e) {
            console.log('#Duy Phan console error', e);
        }
    }, [yId]);

    return (
        <div
            ref={videoRef}
            className={clsx(styles.player, className, {
                [styles.none]: !url,
            })}
        />
    );
};
