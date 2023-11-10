import { useStore } from 'effector-react';
import { memo, useEffect } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import {
    $businessCategoriesStore,
    $modeTemplateStore,
    $profileStore,
    $profileTemplatesCountStore,
    $queryProfileTemplatesStore,
    $queryTemplatesStore,
    setQueryProfileTemplatesEvent,
    setQueryTemplatesEvent,
} from 'src/store';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { mapEmoji, parseEmoji } from 'shared-utils';
import clsx from 'clsx';
import { CUSTOM_CATEROFY_BUSSINESS } from 'shared-const';
import { TemplateCategoryType } from 'shared-types';
import styles from './Menus.module.scss';
import { MenuItemTemplate } from '../MenuItem/MenuItem';

const Component = () => {
    const { list } = useStore($businessCategoriesStore);
    const { businessCategories = [] } = useStore($queryTemplatesStore);
    const { state: profileTemplatesCount } = useStore(
        $profileTemplatesCountStore,
    );
    const profile = useStore($profileStore);
    const mode = useStore($modeTemplateStore);
    const templatesLimit = `${profileTemplatesCount.count}/${profile.maxTemplatesNumber}`;
    const queryProfileTemplates = useStore($queryProfileTemplatesStore);

    useEffect(() => {
        setQueryProfileTemplatesEvent({ categoryType: 'default' });
    }, []);

    const selectMenu = (id: string) => {
        setQueryTemplatesEvent({
            businessCategories: id === 'all' ? undefined : [id],
            skip: 0,
        });
    };

    const selectMyRooms = (categoryType: TemplateCategoryType) => {
        setQueryProfileTemplatesEvent({ skip: 0, categoryType });
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
                        mode === 'private' &&
                        queryProfileTemplates.categoryType === 'default',
                })}
                onClick={() => selectMyRooms('default')}
            >
                <CustomGrid container direction="row" alignItems="center">
                    <CustomGrid className={styles.emoji}>
                        {parseEmoji(mapEmoji('1f6d6'))}
                    </CustomGrid>
                    <CustomTypography fontSize={13}>
                        My Rooms ({templatesLimit})
                    </CustomTypography>
                </CustomGrid>
            </CustomPaper>
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
            <MenuItemTemplate
                isActive={
                    mode === 'private' &&
                    queryProfileTemplates.categoryType === 'interior-design'
                }
                item={CUSTOM_CATEROFY_BUSSINESS}
                onSelect={() => selectMyRooms('interior-design')}
            />
        </CustomGrid>
    );
};
export const MenusTemplate = memo(Component);
