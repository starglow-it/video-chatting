import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CSSProperties, memo } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { IBusinessCategory } from 'shared-types';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import clsx from 'clsx';
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

    const style = {
        '--color': item.color,
    } as React.CSSProperties;

    return (
        <CustomPaper
            className={clsx(styles.menuWrapper, {
                [styles.active]: isActive,
            })}
            style={style}
        >
            <CustomGrid
                container
                direction="row"
                alignItems="center"
                onClick={selectMenu}
                className={styles.menu}
            >
                <CustomTypography fontSize={15}>
                    {item.value}
                </CustomTypography>
            </CustomGrid>
        </CustomPaper>
    );
};
export const MenuItemTemplate = memo(Component);
