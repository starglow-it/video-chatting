import { CustomRange } from '@library/custom/CustomRange/CustomRange';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import clsx from 'clsx';
import { memo, useEffect, useRef, useState } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { SpeakerIcon } from 'shared-frontend/icons/OtherIcons/SpeakerIcon';
import { IMediaItem } from 'src/store/roomStores/meeting/meetingBackground/types';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { useStore } from 'effector-react';
import { $isToggleMeetingAudioStore } from 'src/store/roomStores';
import styles from './MeetingManageAudio.module.scss';

const Component = ({ item }: { item: IMediaItem }) => {
    const refAudio = useRef<HTMLAudioElement | null>(null);
    const refIsFirstTime = useRef<boolean>(true);
    const [volume, setVolume] = useState<number>(0);
    const [isPlay, setIsPlay] = useState(false);
    const isPlayAll = useStore($isToggleMeetingAudioStore);

    const handleChangeVolume = (e: Event, value: number) => {
        setVolume(value);
        if (refIsFirstTime.current) refIsFirstTime.current = false;
    };

    const toggleVolume = () => {
        setIsPlay(!isPlay);
    };

    const playAudio = () => {
        refAudio.current?.play();
    };

    const pauseAudio = () => {
        refAudio.current?.pause();
    };

    useEffect(() => {
        if (isPlayAll) {
            if (isPlay && volume > 0) {
                playAudio();
            }
        } else {
            pauseAudio();
        }
    }, [isPlayAll]);

    useEffect(() => {
        isPlay ? playAudio() : pauseAudio();
    }, [isPlay]);

    useEffect(() => {
        if (refAudio.current) {
            refAudio.current.volume = volume / 100;
        }

        if (volume > 0) {
            if (isPlay) playAudio();
            else {
                if (!refIsFirstTime.current) setIsPlay(true);
            }
        } else {
            setIsPlay(false);
            pauseAudio();
        }
    }, [volume]);

    return (
        <CustomGrid container flexDirection="column" marginBottom="10px">
            <CustomGrid flexDirection="row" alignItems="center" display="flex">
                <CustomImage
                    src={item.mediaCategory.emojiUrl}
                    width={15}
                    height={15}
                    className={styles.emoji}
                />
                <CustomTypography
                    color="colors.white.primary"
                    fontSize={12}
                    marginLeft="2px"
                >
                    {item.name}
                </CustomTypography>
            </CustomGrid>

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
                src={item.url}
                ref={refAudio}
                className={styles.audioPlay}
                loop
            />
        </CustomGrid>
    );
};
export const AudioItem = memo(Component);
