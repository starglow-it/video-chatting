import { memo } from 'react';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { Translation } from '@components/Translation/Translation';
import { ButtonsGroup } from '@components/ButtonsGroup/ButtonsGroup';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import {
    $confirmDeleteMediaDialogStore,
    closeAdminDialogEvent,
    deleteMediaEvent,
} from 'src/store';
import { useStore } from 'effector-react';
import { AdminDialogsEnum } from 'src/store/types';
import styles from './ConfirmDeleteMediaDialog.module.scss';

const Component = () => {
    const confirmDeleteMediaDialog = useStore($confirmDeleteMediaDialogStore);

    const handleClose = () => {
        closeAdminDialogEvent(AdminDialogsEnum.confirmDeleteMediaDialog);
    };

    const handleConfirmDelete = () => {
        deleteMediaEvent();
        handleClose();
    };

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={confirmDeleteMediaDialog}
        >
            <CustomTypography variant="h3bold">
                <Translation
                    nameSpace="rooms"
                    translation="confirmDeleteMedia.title"
                />
            </CustomTypography>

            <CustomTypography textAlign="center">
                <Translation
                    nameSpace="rooms"
                    translation="confirmDeleteMedia.text"
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
export const ConfirmDeleteMediaDialog = memo(Component);
