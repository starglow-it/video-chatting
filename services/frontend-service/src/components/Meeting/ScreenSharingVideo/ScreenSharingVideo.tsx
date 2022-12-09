import React, { memo, useEffect, useRef } from 'react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// styles
import styles from './ScreenSharingVideo.module.scss';

// types
import { ScreenSharingVideoProps } from './types';

const Component = ({ videoTrack }: ScreenSharingVideoProps) => {
    const videoContainer = useRef<HTMLVideoElement | null>(null);

    const mediaStreamRef = useRef(new MediaStream());

    useEffect(() => {
        if (videoTrack) {
            const videoTracks = mediaStreamRef.current.getVideoTracks();

            if (videoTracks.length) {
                videoTracks.forEach(track => {
                    mediaStreamRef.current.removeTrack(track);
                });
            }

            mediaStreamRef.current.addTrack(videoTrack);

            if (videoContainer.current) videoContainer.current.srcObject = mediaStreamRef.current;
        }
    }, [videoTrack]);

    return (
        <CustomGrid
            className={styles.videoWrapper}
            container
            justifyContent="center"
            alignItems="center"
        >
            <video ref={videoContainer} className={styles.video} playsInline muted autoPlay />
        </CustomGrid>
    );
};

export const ScreenSharingVideo = memo(Component);
