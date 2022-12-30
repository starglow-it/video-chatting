import {
    memo, useCallback
} from 'react';
import { useStore } from 'effector-react';

// shared
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { Translation } from '@components/Translation/Translation';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ButtonsGroup } from '@components/ButtonsGroup/ButtonsGroup';

// types
import { AdminDialogsEnum } from '../../../store/types';

// styles
import styles from './CancelEditRoomDialog.module.scss';

// stores
import {
    $cancelEditRoomDialogStore,
    closeAdminDialogEvent,
} from '../../../store';

const Component = ({ onConfirm }) => {
    const cancelEditRoomDialog = useStore($cancelEditRoomDialogStore);

    const handleClose = useCallback(() => {
        closeAdminDialogEvent(AdminDialogsEnum.cancelEditRoomDialog);
    }, []);

    const handleCancelEditRoom = useCallback(() => {
        closeAdminDialogEvent(AdminDialogsEnum.cancelEditRoomDialog);
        onConfirm?.();
    }, [onConfirm]);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={cancelEditRoomDialog}
        >
            <CustomTypography variant="h3bold">
                <Translation
                    nameSpace="rooms"
                    translation="cancelEdit.title"
                />
            </CustomTypography>

            <CustomTypography>
                <Translation
                    nameSpace="rooms"
                    translation="cancelEdit.text"
                />
            </CustomTypography>
            <ButtonsGroup className={styles.buttons}>
                <CustomButton
                    variant="custom-cancel"
                    onClick={handleClose}
                    label={
                        <Translation
                            nameSpace="rooms"
                            translation="cancelEdit.cancelButton"
                        />
                    }
                />
                <CustomButton
                    onClick={handleCancelEditRoom}
                    label={
                        <Translation
                            nameSpace="rooms"
                            translation="cancelEdit.confirmButton"
                        />
                    }
                />
            </ButtonsGroup>
        </CustomDialog>
    );
};

export const CancelEditRoomDialog = memo(Component);
