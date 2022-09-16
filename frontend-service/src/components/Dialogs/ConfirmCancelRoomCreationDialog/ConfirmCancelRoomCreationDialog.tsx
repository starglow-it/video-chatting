import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// stores
import { $appDialogsStore, appDialogsApi } from '../../../store';

// types
import { ConfirmCancelRoomCreationDialogProps } from './types';
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './ConfirmCancelRoomCreationDialog.module.scss';

const Component = ({ onConfirm }: ConfirmCancelRoomCreationDialogProps) => {
    const { confirmCancelRoomCreationDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmCancelRoomCreationDialog,
        });
    }, []);

    const handleConfirmCancel = useCallback(() => {
        onConfirm?.();
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmCancelRoomCreationDialog,
        });
    }, [onConfirm]);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={confirmCancelRoomCreationDialog}
            onBackdropClick={handleClose}
            onClose={handleClose}
        >
            <CustomGrid container direction="column" alignItems="center" justifyContent="center">
                <CustomTypography
                    variant="h4bold"
                    nameSpace="createRoom"
                    translation="cancel.title"
                />
                <CustomTypography
                    className={styles.text}
                    nameSpace="createRoom"
                    translation="cancel.description"
                />
                <CustomGrid container wrap="nowrap" gap={2}>
                    <CustomButton
                        variant="custom-cancel"
                        nameSpace="createRoom"
                        translation="cancel.buttons.stay"
                        onClick={handleClose}
                    />
                    <CustomButton
                        variant="custom-danger"
                        nameSpace="createRoom"
                        translation="cancel.buttons.cancel"
                        onClick={handleConfirmCancel}
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};

export const ConfirmCancelRoomCreationDialog = memo(Component);
