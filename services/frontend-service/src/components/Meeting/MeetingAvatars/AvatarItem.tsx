import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { IMeetingAvatar } from 'shared-types';
import clsx from 'clsx';
import styles from './AvatarItem.module.scss';

export const AvatarItem = ({
    item,
    onSelect,
    isActive,
    disabled = false,
}: {
    item: IMeetingAvatar;
    onSelect: (id: string) => void;
    isActive: boolean;
    disabled: boolean;
}) => {
    return (
        <CustomGrid className={styles.item}>
            <CustomGrid
                className={clsx(styles.bound, {
                    [styles.active]: isActive,
                    [styles.disabled]: disabled,
                })}
                onClick={() => onSelect(item.id ?? '')}
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
