import React, { memo } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';

// utils
import { formatDate } from '../../../utils/time/formatDate';

// styles
import styles from './TimeExpiredDialog.module.scss';

// stores
import { $appDialogsStore, $profileStore, appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// const
import { profileRoute } from '../../../const/client-routes';

const Component = () => {
    const router = useRouter();
    const profile = useStore($profileStore);

    const { timeExpiredDialog } = useStore($appDialogsStore);

    const handleClose = () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.timeExpiredDialog,
        });
    };

    const handleUpgradeSubscription = () => {
        router.push(profileRoute);
        handleClose();
    };

    const renewTime = formatDate(
        profile?.renewSubscriptionTimestampInSeconds
            ? profile.renewSubscriptionTimestampInSeconds * 1000
            : Date.now(),
        'dd MMM',
    );

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={timeExpiredDialog}
            onClose={handleClose}
        >
            <CustomGrid container direction="column" alignItems="center" justifyContent="center">
                <CustomTypography
                    variant="h3bold"
                    textAlign="center"
                    nameSpace="subscriptions"
                    translation="timeExpired.title"
                />
                <CustomTypography
                    textAlign="center"
                    nameSpace="subscriptions"
                    translation="timeExpired.text"
                    className={styles.text}
                    options={{ renewTime }}
                />
                <CustomButton
                    className={styles.button}
                    onClick={handleUpgradeSubscription}
                    nameSpace="common"
                    translation="buttons.upgrade"
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const TimeExpiredDialog = memo(Component);
