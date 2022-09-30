import React, { memo } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { WarningIcon } from '@library/icons/WarningIcon';

// styles
import styles from './HostTimeExpiredDialog.module.scss';

// stores
import { $appDialogsStore, appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// const
import { dashboardRoute } from '../../../const/client-routes';

const Component = () => {
    const router = useRouter();

    const { hostTimeExpiredDialog } = useStore($appDialogsStore);

    const handleClose = () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.timeExpiredDialog,
        });
        router.push(dashboardRoute);
    };

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={hostTimeExpiredDialog}
            onClose={handleClose}
        >
            <CustomGrid container alignItems="center" direction="column">
                <CustomGrid container alignItems="center" justifyContent="center">
                    <WarningIcon className={styles.icon} width="36px" height="36px" />
                    <CustomTypography
                        variant="h3bold"
                        nameSpace="meeting"
                        translation="expired.title"
                    />
                </CustomGrid>

                <CustomTypography
                    textAlign="center"
                    nameSpace="meeting"
                    translation="expired.text"
                />

                <CustomButton
                    nameSpace="meeting"
                    translation="expired.button"
                    onClick={handleClose}
                    className={styles.button}
                    variant="custom-cancel"
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const HostTimeExpiredDialog = memo(Component);
