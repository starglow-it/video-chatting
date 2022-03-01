import React, { memo, useEffect, useRef } from 'react';

import { MeetingUserAudioItemProps } from '@components/Meeting/MeetingUserAudioItem/types';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

import { useAudioVolumeMeter } from '../../../hooks/useAudioAnalyzer';

import styles from './MeetingUserAudioItem.module.scss';

const MeetingUserAudioItem = memo(
    ({ isLocal, audioTrack, isMicEnabled }: MeetingUserAudioItemProps) => {
        const mediaStreamRef = useRef(new MediaStream());
        const container = useRef<HTMLAudioElement>(null);

        const { volume, onStartVolumeIndicator } = useAudioVolumeMeter(mediaStreamRef.current);

        useEffect(() => {
            if (audioTrack) {
                const audioTracks = mediaStreamRef.current.getAudioTracks();

                if (audioTracks.length) {
                    audioTracks.forEach(track => {
                        mediaStreamRef.current.removeTrack(track);
                    });
                }

                const nativeAudioTrack = audioTrack.getMediaStreamTrack();

                mediaStreamRef.current.addTrack(nativeAudioTrack);

                if (container.current) {
                    container.current.srcObject = mediaStreamRef.current;
                    onStartVolumeIndicator();
                    container.current.play();
                }
            }
        }, [container.current, audioTrack]);

        const style = { '--opacity': volume / 5 } as React.CSSProperties;

        return (
            <CustomBox className={styles.meetingAudioWrapper} style={style}>
                <audio ref={container} autoPlay playsInline muted={!isMicEnabled || isLocal} />
            </CustomBox>
        );
    },
);

export { MeetingUserAudioItem };
