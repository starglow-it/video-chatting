import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

// library
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
// store
import { $appDialogsStore, appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// shared

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
                <CustomImage
                    src="/images/email2.webp"
                    width="52px"
                    height="52px"
                />
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
