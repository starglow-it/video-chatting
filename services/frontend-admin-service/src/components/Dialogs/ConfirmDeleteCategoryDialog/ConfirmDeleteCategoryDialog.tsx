import { memo } from 'react';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import styles from './ConfirmDeleteCategoryDialog.module.scss';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { Translation } from '@components/Translation/Translation';
import { ButtonsGroup } from '@components/ButtonsGroup/ButtonsGroup';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import {
    $backgroundsManageStore,
    $categoryIdDeleteStore,
    $confirmDeleteCategoryDialogStore,
    closeAdminDialogEvent,
    deleteCategoryEvent,
} from 'src/store';
import { useStore, useStoreMap } from 'effector-react';
import { AdminDialogsEnum } from 'src/store/types';

const Component = () => {
    const confirmDeleteCategoryDialog = useStore(
        $confirmDeleteCategoryDialogStore,
    );

    const categoryId = useStore($categoryIdDeleteStore);
    const category = useStoreMap({
        store: $backgroundsManageStore,
        keys: [categoryId],
        fn: (state, [categoryId]) =>
            state.categories.find(item => item.id === categoryId),
    });

    const handleClose = () => {
        closeAdminDialogEvent(AdminDialogsEnum.confirmDeleteCategoryDialog);
    };

    const handleConfirmDelete = () => {
        deleteCategoryEvent();
        handleClose();
    };

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={confirmDeleteCategoryDialog}
        >
            <CustomTypography variant="h3bold">
                <Translation
                    nameSpace="rooms"
                    translation="confirmDeleteCategory.title"
                    options={{ categoryName: category?.value }}
                />
            </CustomTypography>

            <CustomTypography textAlign="center">
                <Translation
                    nameSpace="rooms"
                    translation="confirmDeleteCategory.text"
                />
            </CustomTypography>
            <ButtonsGroup className={styles.buttons}>
                <CustomButton
                    onClick={handleClose}
                    variant="custom-cancel"
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.cancel"
                        />
                    }
                />
                <CustomButton
                    variant="custom-danger"
                    onClick={handleConfirmDelete}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.delete"
                        />
                    }
                />
            </ButtonsGroup>
        </CustomDialog>
    );
};
export const ConfirmDeleteCategoryDialog = memo(Component);
