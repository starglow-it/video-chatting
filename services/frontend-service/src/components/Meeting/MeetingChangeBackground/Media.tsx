import { Skeleton } from '@mui/material';
import clsx from 'clsx';
import { memo, useState } from 'react';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { ICategoryMedia } from '../../../store/roomStores/meeting/meetingBackground/types';
import styles from './MeetingChangeBackground.module.scss';

const Component = ({
    isActive = false,
    item,
    onSelect,
}: {
    isActive: boolean;
    item: ICategoryMedia;
    onSelect: (id: string) => void;
}) => {
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const handleLoadEnd = () => {
        setIsLoaded(true);
    };

    return (
        <CustomGrid
            className={clsx(styles.container, { [styles.active]: isActive })}
            item
            onClick={() => onSelect(item.id)}
        >
            {!isLoaded && (
                <Skeleton width={60} height={60} className={styles.skeleton} variant="rectangular" />
            )}
            {item.url !== '' ? (
                <CustomImage
                    src={item.url}
                    width={60}
                    height={60}
                    className={styles.image}
                    onLoad={handleLoadEnd}
                />
            ) : (
                <CustomBox />
            )}
        </CustomGrid>
    );
};

export const Media = memo(Component);
