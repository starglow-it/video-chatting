import React, { memo, useEffect, useRef } from 'react';

// types
import { MeetingUserAudioItemProps } from '@components/Meeting/MeetingUserAudioItem/types';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// hooks
import { useAudioVolumeMeter } from '@hooks/useAudioAnalyzer';

// styles
import styles from './MeetingUserAudioItem.module.scss';

const Component = ({
    isAuraActive,
    isLocal,
    audioTrack,
    isMicEnabled,
}: MeetingUserAudioItemProps) => {
    const mediaStreamRef = useRef(new MediaStream());
    const container = useRef<HTMLAudioElement>(null);

    const { volume, onStartVolumeIndicator, onStopVolumeIndicator } = useAudioVolumeMeter(
        mediaStreamRef.current,
    );

    useEffect(() => {
        if (audioTrack) {
            const audioTracks = mediaStreamRef.current.getAudioTracks();

            if (audioTracks.length) {
                audioTracks.forEach(track => {
                    mediaStreamRef.current.removeTrack(track);
                });
            }

            mediaStreamRef.current.addTrack(audioTrack);

            if (container.current) {
                container.current.srcObject = mediaStreamRef.current;
                if (!isAuraActive) {
                    onStartVolumeIndicator();
                }
                container.current.play();
            }
        }
    }, [audioTrack]);

    useEffect(() => {
        (isAuraActive ? onStopVolumeIndicator : onStartVolumeIndicator)();
    }, [isAuraActive]);

    const style = { '--opacity': volume / 5 } as React.CSSProperties;

    return (
        <>
            {!isAuraActive && <CustomBox className={styles.meetingAudioWrapper} style={style} />}
            <audio ref={container} autoPlay playsInline muted={!isMicEnabled || isLocal} />
        </>
    );
};

export const MeetingUserAudioItem = memo(Component);
