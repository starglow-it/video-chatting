import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// store
import { $appDialogsStore, appDialogsApi } from '../../../store';

// styles
import styles from './ConfirmChangeRouteDialog.module.scss';

// types
import { AppDialogsEnum } from '../../../store/types';
import { ConfirmChangeRouteDialogProps } from './types';

const Component = ({ onConfirm, onCancel }: ConfirmChangeRouteDialogProps) => {
    const { confirmChangeRouteDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmChangeRouteDialog,
        });
    }, []);

    const handleCancel = useCallback(() => {
        onCancel?.();
    }, [onCancel]);

    const handleConfirm = useCallback(() => {
        onConfirm?.();
    }, [onConfirm]);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={confirmChangeRouteDialog}
            onBackdropClick={handleClose}
            onClose={handleClose}
        >
            <CustomGrid container direction="column" alignItems="center" gap={5}>
                <CustomTypography variant="h4bold" nameSpace="profile" translation="withOutSave" />
                <CustomGrid container gap={1.5} className={styles.buttons} wrap="nowrap">
                    <CustomButton
                        onClick={handleConfirm}
                        nameSpace="common"
                        translation="buttons.saveAndQuit"
                    />
                    <CustomButton
                        variant="custom-cancel"
                        onClick={handleCancel}
                        nameSpace="common"
                        translation="buttons.quit"
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};

export const ConfirmChangeRouteDialog = memo(Component);
