import { memo } from 'react';
import { useToggle } from 'shared-frontend/hooks/useToggle';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomVideoPlayer } from 'shared-frontend/library/custom/CustomVideoPlayer';
import { IFeaturedBackground } from 'shared-types';
import styles from './FeaturedItem.module.scss';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { Fade } from '@mui/material';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { DeleteIcon } from 'shared-frontend/icons/OtherIcons/DeleteIcon';

const Component = ({
    media,
    onDelete,
}: {
    media: IFeaturedBackground;
    onDelete: (id: string) => void;
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
                        width={250}
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
export const FeaturedItem = memo(Component);
