import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { IMeetingAvatar } from 'shared-types';
import clsx from 'clsx';
import styles from './AvatarItem.module.scss';

export const AvatarItem = ({
    item,
    onSelect,
    isActive,
}: {
    item: IMeetingAvatar;
    onSelect: (id: string) => void;
    isActive: boolean;
}) => {
    return (
        <CustomGrid
            className={styles.item}
            onClick={() => onSelect(item.id ?? '')}
        >
            <CustomGrid
                className={clsx(styles.bound, {
                    [styles.active]: isActive,
                })}
            >
                <CustomImage
                    width="100%"
                    height="100%"
                    src={item.resouce.url}
                    className={styles.image}
                />
            </CustomGrid>
        </CustomGrid>
    );
};
