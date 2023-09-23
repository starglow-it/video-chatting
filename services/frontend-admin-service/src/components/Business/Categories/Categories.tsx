import { memo, useRef } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { Translation } from '@components/Translation/Translation';
import { useStore } from 'effector-react';
import {
    $businessCategoriesStore,
    addBusinessCategoriesFx,
    openConfirmDeleteCategoryDialogEvent,
    setBusinessIdDeleteEvent,
    updateBusinessCategoriesFx,
} from 'src/store';
import { AdminDialogsEnum } from 'src/store/types';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { PlusIcon } from 'shared-frontend/icons/OtherIcons/PlusIcon';
import { IBusinessCategory } from 'shared-types';
import { ConfirmDeleteBusinessDialog } from '@components/Dialogs/ConfirmDeleteBusinessDialog/ConfirmDeleteBusinessDialog';
import { ModifyBusinessItem } from '../ModifyBusinessItem/ModifyBusinessItem';
import { BusinessItem } from '../BusinessItem/BusinessItem';
import styles from './Categories.module.scss';

const Component = () => {
    const {
        state: { list: categories },
    } = useStore($businessCategoriesStore);
    const refAddCategory = useRef<{ open(): void; close: () => void }>(null);

    const handleUpdateCategory = (
        category: IBusinessCategory & { id: string },
    ) => {
        updateBusinessCategoriesFx(category);
    };

    const handleDeleteCategory = (categoryId: string) => {
        setBusinessIdDeleteEvent(categoryId);
        openConfirmDeleteCategoryDialogEvent(
            AdminDialogsEnum.confirmDeleteCategoryDialog,
        );
    };

    const toggleAdd = () => {
        refAddCategory.current?.open();
    };

    const handleAddCategory = (
        category: IBusinessCategory & { id: string },
    ) => {
        const newCategory = { ...category } as any;
        delete newCategory.id;
        addBusinessCategoriesFx(newCategory);
    };

    return (
        <>
            <CustomGrid width="450px">
                <CustomPaper className={styles.paper}>
                    <CustomGrid
                        className={styles.header}
                        flexDirection="row"
                        alignItems="center"
                        display="flex"
                    >
                        <CustomTypography
                            variant="h4bold"
                            fontSize={16}
                            flex={1}
                        >
                            <Translation
                                nameSpace="rooms"
                                translation="backgrounds.categories"
                            />
                        </CustomTypography>
                        <ActionButton
                            variant="decline"
                            Icon={<PlusIcon width="20px" height="20px" />}
                            onAction={toggleAdd}
                            className={styles.addIcon}
                        />
                    </CustomGrid>
                    <CustomGrid container className={styles.categories}>
                        <ModifyBusinessItem
                            ref={refAddCategory}
                            category={{
                                id: Date.now().toString(),
                                value: '',
                                key: '',
                                icon: '1f47b',
                                color: '#ffffff',
                            }}
                            onSave={handleAddCategory}
                            className={styles.boxAdd}
                        />
                        {categories.map(item => (
                            <BusinessItem
                                key={item.id}
                                category={item}
                                onSave={handleUpdateCategory}
                                onDelete={handleDeleteCategory}
                            />
                        ))}
                    </CustomGrid>
                </CustomPaper>
            </CustomGrid>
            <ConfirmDeleteBusinessDialog />
        </>
    );
};
export const BusinessCategories = memo(Component);
