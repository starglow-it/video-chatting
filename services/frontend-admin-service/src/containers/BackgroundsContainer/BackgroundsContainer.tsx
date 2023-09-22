import { Translation } from '@components/Translation/Translation';
import { memo, useEffect } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './BackgroundsContainer.module.scss';
import {
    $backgroundsManageStore,
    getCategoriesFx,
    selectCategoryEvent,
} from 'src/store';
import { useStore } from 'effector-react';
import { Medias } from '@components/Backgrounds/Medias/Medias';
import { ConfirmDeleteMediaDialog } from '@components/Dialogs/ConfirmDeleteMediaDialog/ConfirmDeleteMediaDialog';
import { ConfirmDeleteCategoryDialog } from '@components/Dialogs/ConfirmDeleteCategoryDialog/ConfirmDeleteCategoryDialog';
import { Categories } from '@components/Backgrounds/Categories/Categories';

const Component = () => {
    const { categories } = useStore($backgroundsManageStore);

    useEffect(() => {
        (async () => getCategoriesFx())();
    }, []);

    useEffect(() => {
        if (categories.length) {
            selectCategoryEvent(categories[0].id);
        }
    }, [categories.length]);

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
                    <Categories />
                    <Medias />
                </CustomGrid>
            </CustomGrid>
            <ConfirmDeleteMediaDialog />
            <ConfirmDeleteCategoryDialog />
        </CustomGrid>
    );
};

export const BackgroundsContainer = memo(Component);
