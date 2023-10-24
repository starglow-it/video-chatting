import { useEffect, useRef } from 'react';
import YouTubePlayer from 'youtube-player';
import clsx from 'clsx';
import { PropsWithClassName } from 'shared-frontend/types';
import styles from './CustomYoutubePlayer.module.scss';
import config from '../../../const/config';

export const CustomYoutubePlayer = ({
    url,
    className,
}: PropsWithClassName<{ url: string; className?: string }>) => {
    const videoRef = useRef<any>(null);

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
        }

        // Return null if no match is found
        return null;
    }

    useEffect(() => {
        const youtubeId = getYouTubeVideoId(url);
        let player: any = null;
        if (youtubeId) {
            player = YouTubePlayer(videoRef.current, {
                videoId: youtubeId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    loop: 1,
                    origin: config.frontendUrl,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                },
            });

            player.on('ready', () => {
                console.log('#Duy Phan console', player);
                player.playVideo();
            });
        }
        return () => {
            player?.destroy();
        };
    }, []);

    return <div ref={videoRef} className={clsx(styles.player, className)} />;
};
