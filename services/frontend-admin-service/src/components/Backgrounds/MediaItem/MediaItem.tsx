import { memo, useState } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { DeleteIcon } from 'shared-frontend/icons/OtherIcons/DeleteIcon';
import styles from './MediaItem.module.scss';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { IBackgroundMedia } from 'src/store/backgrounds/types';
import { Fade } from '@mui/material';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

const Component = ({
    media,
    onDelete,
}: {
    media: IBackgroundMedia;
    onDelete: (mediaId: string) => void;
}) => {
    const [isHover, setIsHover] = useState<boolean>(false);

    const showHover = () => setIsHover(true);

    const hideHover = () => setIsHover(false);

    return (
        <CustomPaper
            className={styles.wrapper}
            onMouseEnter={showHover}
            onMouseLeave={hideHover}
        >
            <CustomGrid container flexDirection="row" alignItems="center">
                <CustomImage
                    src={media.url}
                    width={160}
                    height={150}
                    className={styles.image}
                />
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
        </CustomPaper>
    );
};
export const MediaItem = memo(Component);
