import clsx from 'clsx';
import { memo } from 'react';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import styles from './MeetingChangeBackground.module.scss';

const Component = ({
    isActive = false,
    item,
    onSelect,
}: {
    isActive: boolean;
    item: any;
    onSelect: (id: string) => void;
}) => {
    console.log(isActive);
    return (
        <CustomGrid
            className={clsx(styles.container, { [styles.active]: isActive })}
            item
            onClick={() => onSelect(item.id)}
        >
            {item.url !== '' ? (
                <CustomImage
                    src={item.url}
                    width={60}
                    height={60}
                    className={styles.image}
                />
            ) : (
                <CustomBox />
            )}
        </CustomGrid>
    );
};

export const Images = memo(Component);
