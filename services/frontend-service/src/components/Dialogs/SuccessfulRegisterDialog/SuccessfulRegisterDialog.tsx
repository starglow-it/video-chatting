import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

// library
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';

// store
import { $appDialogsStore, appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// shared
import { CustomImage } from 'shared-frontend/library';

// styles
import styles from './SuccessfulRegisterDialog.module.scss';

const Component = () => {
    const { isUserRegisteredDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.isUserRegisteredDialog,
        });
    }, []);

    return (
        <CustomDialog
            open={isUserRegisteredDialog}
            contentClassName={styles.wrapper}
            onClose={handleClose}
        >
            <CustomGrid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                className={styles.container}
            >
                <CustomImage src="/images/email2.png" width="52px" height="52px" />
                <CustomTypography
                    variant="h2bold"
                    nameSpace="register"
                    translation="registerSuccess.title"
                    className={styles.title}
                />
                <CustomTypography
                    variant="body2"
                    align="center"
                    nameSpace="register"
                    translation="registerSuccess.text"
                    className={styles.text}
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const SuccessfulRegisterDialog = memo(Component);
