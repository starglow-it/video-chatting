import { useStore } from 'effector-react';
import { memo, useEffect } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import {
    $businessCategoriesStore,
    $modeTemplateStore,
    $profileStore,
    $profileTemplatesCountStore,
    $queryTemplatesStore,
    setQueryProfileTemplatesEvent,
    setQueryTemplatesEvent,
} from 'src/store';
import { MenuItemTemplate } from '../MenuItem/MenuItem';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { mapEmoji, parseEmoji } from 'shared-utils';
import styles from './Menus.module.scss';
import clsx from 'clsx';

const Component = () => {
    const { list } = useStore($businessCategoriesStore);
    const { businessCategories = [] } = useStore($queryTemplatesStore);
    const { state: profileTemplatesCount } = useStore(
        $profileTemplatesCountStore,
    );
    const profile = useStore($profileStore);
    const mode = useStore($modeTemplateStore);
    const templatesLimit = `${profileTemplatesCount.count}/${profile.maxTemplatesNumber}`;

    useEffect(() => {
        setQueryProfileTemplatesEvent({});
    }, []);

    const selectMenu = (id: string) => {
        setQueryTemplatesEvent({ businessCategories: [id], skip: 0 });
    };

    const selectMyRooms = () => {
        setQueryProfileTemplatesEvent({ skip: 0 });
    };

    return (
        <CustomGrid
            container
            direction="row"
            alignItems="center"
            className={styles.wrapper}
        >
            <CustomPaper
                className={clsx(styles.barge, {
                    [styles.active]: mode === 'private',
                })}
                onClick={selectMyRooms}
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
            <CustomGrid
                container
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                flex={1}
                marginLeft={1}
            >
                {list.map(item => (
                    <MenuItemTemplate
                        key={item.id}
                        isActive={businessCategories.includes(item.id)}
                        item={item}
                        onSelect={selectMenu}
                    />
                ))}
            </CustomGrid>
        </CustomGrid>
    );
};
export const MenusTemplate = memo(Component);
