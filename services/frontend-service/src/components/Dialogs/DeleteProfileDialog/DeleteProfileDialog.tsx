import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import Router from 'next/router';

// custom
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// types
import { Translation } from '@library/common/Translation/Translation';
import { AppDialogsEnum } from '../../../store/types';

// stores
import {
    $appDialogsStore,
    appDialogsApi,
    deleteProfileFx,
} from '../../../store';

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
        <CustomDialog
            contentClassName={styles.content}
            open={deleteProfileDialog}
        >
            <CustomTypography
                display="block"
                textAlign="center"
                nameSpace="profile"
                translation="deleteProfileConfirm"
            />
            <CustomGrid
                container
                wrap="nowrap"
                gap={2}
                className={styles.buttonsWrapper}
            >
                <CustomButton
                    variant="custom-cancel"
                    className={styles.button}
                    onClick={handleClose}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.cancel"
                        />
                    }
                />
                <CustomButton
                    variant="custom-danger"
                    className={styles.button}
                    onClick={handleDeleteProfile}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.delete"
                        />
                    }
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const DeleteProfileDialog = memo(Component);
