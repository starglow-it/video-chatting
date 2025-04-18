import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { memo } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { IBusinessCategory } from 'shared-types';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import clsx from 'clsx';
import { mapEmoji, parseEmoji } from 'shared-utils';
import styles from './MenuItem.module.scss';

const Component = ({
    onSelect,
    item,
    isActive,
}: {
    onSelect: (id: string) => void;
    item: IBusinessCategory & { id: string };
    isActive: boolean;
}) => {
    const selectMenu = () => {
        onSelect(item.id);
    };

    return (
        <CustomPaper
            className={clsx(styles.menuWrapper, {
                [styles.active]: isActive,
            })}
        >
            <CustomGrid
                container
                direction="row"
                alignItems="center"
                onClick={selectMenu}
                justifyContent="center"
            >
                <CustomGrid fontSize={20} marginRight={1}>
                    {parseEmoji(mapEmoji(item.icon))}
                </CustomGrid>
                <CustomTypography fontSize={13}>{item.value}</CustomTypography>
            </CustomGrid>
        </CustomPaper>
    );
};
export const MenuItemTemplate = memo(Component);
