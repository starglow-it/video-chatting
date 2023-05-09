import { Translation } from '@components/Translation/Translation';
import { memo, useEffect } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './BackgroundsContainer.module.scss';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';

import { CategoryItem } from '@components/Backgrounds/CategoryItem/CategoryItem';
import { MediaItem } from '@components/Backgrounds/MediaItem/MediaItem';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { UploadFolderIcon } from 'shared-frontend/icons/OtherIcons/UploadFolderIcon';
import {
    $backgroundsManageStore,
    getCategoriesFx,
    getMediasFx,
    selectCategoryEvent,
    updateCategoryFx,
} from 'src/store';
import { useStore } from 'effector-react';
import { IBackgroundCategory } from 'src/store/backgrounds/types';
import { Medias } from '@components/Backgrounds/Medias/Medias';

const Component = () => {
    const { categories, medias, categorySelected } = useStore(
        $backgroundsManageStore,
    );

    useEffect(() => {
        (async () => getCategoriesFx())();
    }, []);

    useEffect(() => {
        if (categories.length) {
            selectCategoryEvent(categories[0].id);
        }
    }, [categories.length]);

    const selectCategory = (categoryId: string) => {
        selectCategoryEvent(categoryId);
    };

    const handleUpdateCategory = (category: IBackgroundCategory) => {
        updateCategoryFx(category);
    };

    return (
        <CustomGrid
            container
            direction="column"
            alignItems="center"
            className={styles.wrapper}
        >
            <CustomGrid
                container
                justifyContent="center"
                alignItems="center"
                gap={1.5}
            >
                <CustomTypography variant="h1">
                    <Translation
                        nameSpace="common"
                        translation="backgrounds.title"
                    />
                </CustomTypography>
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="flex-start"
                >
                    <CustomGrid sm={3} marginRight={2}>
                        <CustomPaper className={styles.paper}>
                            <CustomGrid className={styles.header}>
                                <CustomTypography variant="h4bold" fontSize={16}>
                                    <Translation
                                        nameSpace="common"
                                        translation="backgrounds.title"
                                    />
                                </CustomTypography>
                            </CustomGrid>
                            <CustomGrid container>
                                {categories.map(item => (
                                    <CategoryItem
                                        key={item.id}
                                        category={item}
                                        isActive={item.id === categorySelected}
                                        onClick={selectCategory}
                                        onSave={handleUpdateCategory}
                                    />
                                ))}
                            </CustomGrid>
                        </CustomPaper>
                    </CustomGrid>
                    <Medias />
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};

export const BackgroundsContainer = memo(Component);
