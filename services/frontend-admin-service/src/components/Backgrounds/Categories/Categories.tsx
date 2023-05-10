import { memo, useRef } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import styles from './Categories.module.scss';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { Translation } from '@components/Translation/Translation';
import { CategoryItem } from '../CategoryItem/CategoryItem';
import { useStore } from 'effector-react';
import {
    $backgroundsManageStore,
    addCategoryFx,
    openConfirmDeleteCategoryDialogEvent,
    selectCategoryEvent,
    setCategoryIdDeleteEvent,
    updateCategoryFx,
} from 'src/store';
import { IBackgroundCategory } from 'src/store/backgrounds/types';
import { AdminDialogsEnum } from 'src/store/types';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { PlusIcon } from 'shared-frontend/icons/OtherIcons/PlusIcon';
import { ModifyCategoryItem } from '../ModifyCategoryItem/ModifyCategoryItem';
import { MediaCategoryType } from 'shared-types';

const Component = () => {
    const { categories, categorySelected } = useStore($backgroundsManageStore);
    const refAddCategory = useRef(null);

    const selectCategory = (categoryId: string) => {
        selectCategoryEvent(categoryId);
    };

    const handleUpdateCategory = (category: IBackgroundCategory) => {
        updateCategoryFx(category);
    };

    const handleDeleteCategory = (categoryId: string) => {
        setCategoryIdDeleteEvent(categoryId);
        openConfirmDeleteCategoryDialogEvent(
            AdminDialogsEnum.confirmDeleteCategoryDialog,
        );
    };

    const toggleAdd = () => {
        refAddCategory.current?.open();
    };

    const handleAddCategory = (category: IBackgroundCategory) => {
        const newCategory = { ...category };
        delete newCategory.id;
        addCategoryFx(newCategory);
    };

    return (
        <CustomGrid sm={3} marginRight={2}>
            <CustomPaper className={styles.paper}>
                <CustomGrid
                    className={styles.header}
                    flexDirection="row"
                    alignItems="center"
                    display="flex"
                >
                    <CustomTypography variant="h4bold" fontSize={16} flex={1}>
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
                    <ModifyCategoryItem
                        ref={refAddCategory}
                        category={{
                            id: Date.now().toString(),
                            value: '',
                            key: '',
                            emojiUrl: '1f47b',
                            type: MediaCategoryType.Background,
                        }}
                        onSave={handleAddCategory}
                        className={styles.boxAdd}
                    />
                    {categories.map(item => (
                        <CategoryItem
                            key={item.id}
                            category={item}
                            isActive={item.id === categorySelected}
                            onClick={selectCategory}
                            onSave={handleUpdateCategory}
                            onDelete={handleDeleteCategory}
                        />
                    ))}
                </CustomGrid>
            </CustomPaper>
        </CustomGrid>
    );
};
export const Categories = memo(Component);
