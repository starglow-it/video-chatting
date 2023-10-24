import { useEffect, useRef } from 'react';
import YouTubePlayer from 'youtube-player';
import clsx from 'clsx';
import { PropsWithClassName } from 'shared-frontend/types';
import styles from './CustomYoutubePlayer.module.scss';
import config from '../../../const/config';

export const CustomYoutubePlayer = ({
    url,
    className,
    volume,
}: PropsWithClassName<{ url: string; className?: string; volume: number }>) => {
    const videoRef = useRef<any>(null);
    const playerRef = useRef<any>(null);

    function getYouTubeVideoId(videoUrl: string) {
        try {
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
            // Handle invalid URLs
            console.error(error);
            return null;
        }

        // Return null if no match is found
        return null;
    }

    const yId = getYouTubeVideoId(url);

    useEffect(() => {
        playerRef.current?.setVolume(volume);
    }, [volume]);

    useEffect(() => {
        if (yId) {
            playerRef.current = YouTubePlayer(videoRef.current, {
                videoId: yId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    origin: config.frontendUrl,
                    loop: 1,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                },
            });

            playerRef.current.on('ready', () => {
                playerRef.current?.playVideo();
                playerRef.current?.setVolume(0);
            });
        }
        return () => {
            playerRef.current?.destroy();
            playerRef.current = null;
        };
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
