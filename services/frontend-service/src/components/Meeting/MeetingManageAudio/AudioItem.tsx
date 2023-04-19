import { CustomRange } from '@library/custom/CustomRange/CustomRange';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import clsx from 'clsx';
import { memo, useEffect, useRef, useState } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import styles from './MeetingManageAudio.module.scss';
import { SpeakerIcon } from 'shared-frontend/icons/OtherIcons/SpeakerIcon';

const Component = () => {
    const refAudio = useRef<HTMLAudioElement | null>(null);
    const refIsFirstTime = useRef<boolean>(true);
    const [volume, setVolume] = useState<number>(50);
    const [isPlay, setIsPlay] = useState(false);

    const handleChangeVolume = (e: Event, value: number) => {
        setVolume(value);
        if (refIsFirstTime.current) refIsFirstTime.current = false;
    };

    const toggleVolume = () => {
        setIsPlay(!isPlay);
    };

    useEffect(() => {
        isPlay ? refAudio.current?.play() : refAudio.current?.pause();
    }, [isPlay]);

    useEffect(() => {
        if (refAudio.current) {
            refAudio.current.volume = volume / 100;
        }

        if (volume > 0) {
            if (isPlay) refAudio.current?.play();
            else {
                if (!refIsFirstTime.current) setIsPlay(true);
            }
        } else {
            setIsPlay(false);
            refAudio.current?.pause();
        }
    }, [volume]);

    return (
        <CustomGrid container flexDirection="column">
            <CustomTypography color="colors.white.primary" fontSize={12}>
                Don coi Orijin - Rogboog
            </CustomTypography>
            <CustomRange
                color="secondary"
                value={volume}
                onChange={handleChangeVolume}
                className={clsx(styles.audioRange, {
                    [styles.inactive]: !volume,
                })}
                size="small"
                Icon={
                    <SpeakerIcon
                        isActive={isPlay && volume > 0}
                        isHalfVolume={volume < 50}
                        width="18px"
                        height="18px"
                        className={styles.icon}
                        onClick={toggleVolume}
                    />
                }
                classes={{ thumb: styles.thumb, root: styles.thumbRoot }}
            />
            <audio
                src="/audio/don-coi.mp3"
                ref={refAudio}
                className={styles.audioPlay}
                loop
            />
        </CustomGrid>
    );
};
export const AudioItem = memo(Component);
