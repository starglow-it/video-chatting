import { useStore } from 'effector-react';
import { memo, useEffect, useState } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import {
    $businessCategoriesStore,
    $profileStore,
    $profileTemplatesCountStore,
    getTemplatesFx,
} from 'src/store';
import { MenuItemTemplate } from '../MenuItem/MenuItem';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { mapEmoji, parseEmoji } from 'shared-utils';
import styles from './Menus.module.scss';

const Component = () => {
    const [ids, setIds] = useState<string[]>([]);
    const { list } = useStore($businessCategoriesStore);
    const { state: profileTemplatesCount } = useStore(
        $profileTemplatesCountStore,
    );
    const profile = useStore($profileStore);
    const templatesLimit = `${profileTemplatesCount.count}/${profile.maxTemplatesNumber}`;

    useEffect(() => {
        getTemplatesFx({
            draft: false,
            isPublic: true,
            limit: 6,
            skip: 0,
            userId: profile.id,
            sort: 'maxParticipants',
            direction: 1,
            businessCategories: ids.length ? ids : undefined,
        });
    }, [ids]);

    const selectMenu = (id: string) => {
        let newIds = [...ids];
        if (newIds.includes(id)) {
            newIds = newIds.filter(item => item !== id);
        } else {
            newIds.push(id);
        }
        setIds(newIds);
    };

    const selectMyRooms = () => {};

    return (
        <CustomGrid
            container
            direction="row"
            alignItems="center"
            className={styles.wrapper}
        >
            <CustomPaper className={styles.barge} onClick={selectMyRooms}>
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
                justifyContent="flex-end"
                flex={1}
            >
                {list.map(item => (
                    <MenuItemTemplate
                        key={item.id}
                        isActive={ids.includes(item.id)}
                        item={item}
                        onSelect={selectMenu}
                    />
                ))}
            </CustomGrid>
        </CustomGrid>
    );
};
export const MenusTemplate = memo(Component);
