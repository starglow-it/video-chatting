import { memo } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { DeleteIcon } from 'shared-frontend/icons/OtherIcons/DeleteIcon';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { IBackgroundMedia } from 'src/store/backgrounds/types';
import { Fade } from '@mui/material';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomVideoPlayer } from 'shared-frontend/library/custom/CustomVideoPlayer';
import { useToggle } from 'shared-frontend/hooks/useToggle';
import styles from './MediaItem.module.scss';

const Component = ({
    media,
    onDelete,
}: {
    media: IBackgroundMedia;
    onDelete: (mediaId: string) => void;
}) => {
    const {
        value: isHover,
        onSwitchOn: showHover,
        onSwitchOff: hideHover,
    } = useToggle(false);

    const { url } = media;

    const renderMedia = () => {
        if (!url) return null;
        switch (media.type) {
            case 'image':
                return (
                    <CustomImage
                        src={url}
                        width={160}
                        height={150}
                        className={styles.image}
                        loading="eager"
                        alt="media-item"
                    />
                );
            case 'video':
                return (
                    <CustomVideoPlayer
                        src={url}
                        volume={0}
                        isPlaying
                        isMuted={false}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <CustomGrid
            className={styles.wrapper}
            onMouseEnter={showHover}
            onMouseLeave={hideHover}
        >
            <CustomGrid
                container
                flexDirection="row"
                alignItems="center"
                height="100%"
            >
                {renderMedia()}
            </CustomGrid>
            <Fade in={isHover}>
                <CustomGrid
                    container
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    className={styles.blur}
                >
                    <ActionButton
                        variant="transparent"
                        onAction={() => onDelete(media.id)}
                        className={styles.deleteBtn}
                        Icon={<DeleteIcon width="22px" height="22px" />}
                    />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
};
export const MediaItem = memo(Component);
