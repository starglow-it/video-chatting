import { Skeleton } from '@mui/material';
import clsx from 'clsx';
import { memo, useState } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { IMediaItem } from '../../../store/roomStores/meeting/meetingBackground/types';
import styles from './MeetingChangeBackground.module.scss';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomVideoPlayer } from 'shared-frontend/library/custom/CustomVideoPlayer';

const Component = ({
    isActive = false,
    item,
    onSelect,
}: {
    isActive: boolean;
    item: IMediaItem;
    onSelect: (id: string) => void;
}) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const handleLoadEnd = () => {
        setIsLoaded(true);
    };
    const url = item.previewUrls.find(img => img.resolution === 240)?.url || '';

    return (
        <CustomGrid
            className={clsx(styles.container, {
                [styles.active]: isActive,
                [styles.player]: item.type === 'video',
            })}
            item
            onClick={() => onSelect(item.id)}
        >
            {!isLoaded && (
                <Skeleton
                    width={63}
                    height={63}
                    className={styles.skeleton}
                    variant="rectangular"
                />
            )}
            <ConditionalRender condition={url !== ''}>
                {item.type === 'image' ? (
                    <CustomImage
                        src={url}
                        width={63}
                        height={63}
                        className={styles.image}
                        onLoad={handleLoadEnd}
                    />
                ) : (
                    <CustomVideoPlayer
                        src={item.url}
                        volume={0}
                        isPlaying
                        isMuted={false}
                    />
                )}
            </ConditionalRender>
        </CustomGrid>
    );
};

export const Media = memo(Component);
