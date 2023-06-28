import { Fade, Skeleton } from '@mui/material';
import clsx from 'clsx';
import { memo, useState } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomVideoPlayer } from 'shared-frontend/library/custom/CustomVideoPlayer';
import { useToggle } from 'shared-frontend/hooks/useToggle';
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';
import { isSafari } from 'shared-utils';
import styles from './MeetingChangeBackground.module.scss';
import { IMediaItem } from '../../../store/roomStores/meeting/meetingBackground/types';

const Component = ({
    isActive = false,
    item,
    onSelect,
    onDelete,
    isShowDelete,
}: {
    isActive: boolean;
    item: IMediaItem;
    onSelect: (id: string) => void;
    onDelete: (mediaId: string) => void;
    isShowDelete: boolean;
}) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const handleLoadEnd = () => {
        setIsLoaded(true);
    };
    const url = item.previewUrls.find(img => img.resolution === 240)?.url || '';

    const {
        value: isHover,
        onSwitchOn: showHover,
        onSwitchOff: hideHover,
    } = useToggle(false);

    const handleDelete = (e: MouseEvent) => {
        e.stopPropagation();
        onDelete(item.id);
    };

    return (
        <CustomGrid
            className={clsx(styles.container, {
                [styles.active]: isActive,
                [styles.player]: item.type === 'video',
            })}
            item
            onClick={() => onSelect(item.id)}
            onMouseEnter={showHover}
            onMouseLeave={hideHover}
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
                {item.type === 'image' || isSafari() ? (
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
                <ConditionalRender
                    condition={Boolean(item.userTemplate && isShowDelete)}
                >
                    <Fade in={isHover}>
                        <CustomGrid
                            className={styles.deleteButton}
                            onClick={handleDelete}
                        >
                            <CloseIcon
                                width="14px"
                                height="14px"
                                className={styles.icon}
                            />
                        </CustomGrid>
                    </Fade>
                </ConditionalRender>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const Media = memo(Component);
