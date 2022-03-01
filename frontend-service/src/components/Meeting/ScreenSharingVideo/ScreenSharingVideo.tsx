import React, { memo, useEffect, useRef } from 'react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// styles
import styles from './ScreenSharingVideo.module.scss';

import { ScreenSharingVideoProps } from './types';

const ScreenSharingVideo = memo(({ videoTrack }: ScreenSharingVideoProps) => {
    const videoContainer = useRef(null);

    const mediaStreamRef = useRef(new MediaStream());

    useEffect(() => {
        if (videoTrack) {
            const videoTracks = mediaStreamRef.current.getVideoTracks();

            if (videoTracks.length) {
                videoTracks.forEach(track => {
                    mediaStreamRef.current.removeTrack(track);
                });
            }

            const nativeVideoTrack = videoTrack.getMediaStreamTrack();

            mediaStreamRef.current.addTrack(nativeVideoTrack);

            if (videoContainer.current) videoContainer.current.srcObject = mediaStreamRef.current;
        }
    }, [videoTrack]);

    return (
        <CustomGrid container justifyContent="center" alignItems="center">
            <video ref={videoContainer} className={styles.video} playsInline muted autoPlay />
        </CustomGrid>
    );
});

export { ScreenSharingVideo };
