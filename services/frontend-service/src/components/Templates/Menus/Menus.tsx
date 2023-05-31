import { useStore } from 'effector-react';
import { memo, useEffect, useState } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { $businessCategoriesStore, getProfileTemplatesFx } from 'src/store';
import { MenuItemTemplate } from '../MenuItem/MenuItem';
import styles from './Menus.module.scss';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';
import { mapEmoji, parseEmoji } from 'shared-utils';

const Component = () => {
    const [ids, setIds] = useState<string[]>([]);
    const { list } = useStore($businessCategoriesStore);

    useEffect(() => {
        getProfileTemplatesFx({ skip: 0, limit: 6, businessCategories: ids });
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

    return (
        <CustomGrid
            container
            direction="row"
            alignItems="center"
            className={styles.wrapper}
        >
            <CustomPaper className={styles.barge}>
                <CustomGrid container direction="row" alignItems="center">
                    <CustomGrid className={styles.emoji}>
                        {parseEmoji(mapEmoji('1f6d6'))}
                    </CustomGrid>
                    <CustomTypography fontSize={13}>My Rooms</CustomTypography>
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
                <CustomPaper className={styles.barge}>
                    <CustomGrid
                        container
                        direction="row"
                        alignItems="center"
                        onClick={selectMenu}
                    >
                        <CustomTypography fontSize={15}>Clear</CustomTypography>
                        <CloseIcon width="22px" height="22px" />
                    </CustomGrid>
                </CustomPaper>
            </CustomGrid>
        </CustomGrid>
    );
};
export const MenusTemplate = memo(Component);
