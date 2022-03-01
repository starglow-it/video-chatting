import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

// library
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';

// store
import { $appDialogsStore, appDialogsApi } from '../../../store/dialogs';

// types
import { AppDialogsEnum } from '../../../store/types';

const SuccessfulRegisterDialog = memo(() => {
    const { isUserRegisteredDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.isUserRegisteredDialog,
        });
    }, []);

    return (
        <CustomDialog open={isUserRegisteredDialog} maxWidth="xs" onClose={handleClose}>
            <CustomGrid container justifyContent="center">
                <CustomTypography
                    variant="h4"
                    nameSpace="register"
                    translation="registerSuccess.title"
                />
                <CustomTypography
                    variant="body2"
                    align="center"
                    nameSpace="register"
                    translation="registerSuccess.text"
                />
            </CustomGrid>
        </CustomDialog>
    );
});

export { SuccessfulRegisterDialog };
