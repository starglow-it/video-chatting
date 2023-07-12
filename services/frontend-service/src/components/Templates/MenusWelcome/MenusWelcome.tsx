import { useStore } from 'effector-react';
import { memo, useEffect } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import {
    $businessCategoriesStore,
    $modeTemplateStore,
    $queryTemplatesStore,
    setModeTemplatesEvent,
    setQueryProfileTemplatesEvent,
    setQueryTemplatesEvent,
} from 'src/store';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { mapEmoji, parseEmoji } from 'shared-utils';
import clsx from 'clsx';
import styles from './MenusWelcome.module.scss';
import { MenuItemTemplate } from '../MenuItem/MenuItem';

const Component = () => {
    const { list } = useStore($businessCategoriesStore);
    const { businessCategories = [] } = useStore($queryTemplatesStore);
    const mode = useStore($modeTemplateStore);

    const selectMenu = (id: string) => {
        setQueryTemplatesEvent({
            businessCategories: id === 'all' ? undefined : [id],
            skip: 0,
        });
    };

    return (
        <CustomGrid
            container
            direction="row"
            alignItems="center"
            justifyContent="center"
            className={styles.wrapper}
        >
            <CustomPaper
                className={clsx(styles.barge, {
                    [styles.active]:
                        !businessCategories.length && mode === 'common',
                })}
                onClick={() => selectMenu('all')}
            >
                <CustomGrid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CustomGrid fontSize={20} marginRight={1}>
                        {parseEmoji(mapEmoji('1f52d'))}
                    </CustomGrid>
                    <CustomTypography fontSize={13}>All</CustomTypography>
                </CustomGrid>
            </CustomPaper>

            {list.map(item => (
                <MenuItemTemplate
                    key={item.id}
                    isActive={businessCategories.includes(item.id)}
                    item={item}
                    onSelect={selectMenu}
                />
            ))}
        </CustomGrid>
    );
};
export const MenusWelcome = memo(Component);
