import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import Router from 'next/router';

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// types
import { AppDialogsEnum } from '../../../store/types';

// stores
import { $appDialogsStore, appDialogsApi, deleteProfileFx } from '../../../store';

// styles
import styles from './DeleteProfileDialog.module.scss';

// const
import { clientRoutes } from '../../../const/client-routes';

const Component = () => {
    const { deleteProfileDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.deleteProfileDialog,
        });
    }, []);

    const handleDeleteProfile = useCallback(async () => {
        await deleteProfileFx();

        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.deleteProfileDialog,
        });

        await Router.push(clientRoutes.loginRoute);
    }, []);

    return (
        <CustomDialog contentClassName={styles.content} open={deleteProfileDialog}>
            <CustomTypography
                display="block"
                textAlign="center"
                nameSpace="profile"
                translation="deleteProfileConfirm"
            />
            <CustomGrid container wrap="nowrap" gap={2} className={styles.buttonsWrapper}>
                <CustomButton
                    variant="custom-cancel"
                    className={styles.button}
                    onClick={handleClose}
                    nameSpace="common"
                    translation="buttons.cancel"
                />
                <CustomButton
                    variant="custom-danger"
                    className={styles.button}
                    onClick={handleDeleteProfile}
                    nameSpace="common"
                    translation="buttons.delete"
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const DeleteProfileDialog = memo(Component);
