import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { WarningIcon } from '@library/icons/WarningIcon';

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// stores
import { $appDialogsStore, appDialogsApi, $meetingErrorStore } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './MeetingErrorDialog.module.scss';

// const
import { dashboardRoute } from '../../../const/client-routes';

const Component = () => {
    const router = useRouter();

    const { meetingErrorDialog } = useStore($appDialogsStore);
    const error = useStore($meetingErrorStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
        if (error === 'meeting.timeLimit') {
            router.push(dashboardRoute);
        }
    }, [error]);

    const { isMobile } = useBrowserDetect();

    return (
        <CustomDialog
            className={clsx(styles.dialog, { [styles.mobile]: isMobile })}
            contentClassName={clsx(styles.content, { [styles.mobile]: isMobile })}
            open={meetingErrorDialog}
            onClose={handleClose}
            onBackdropClick={handleClose}
        >
            <CustomGrid container alignItems="center" direction="column">
                <CustomGrid container alignItems="center" justifyContent="center">
                    <WarningIcon className={styles.icon} width="36px" height="36px" />
                    <CustomTypography
                        variant="h3bold"
                        nameSpace="errors"
                        translation={`${error}.title`}
                    />
                </CustomGrid>

                <CustomTypography
                    textAlign="center"
                    nameSpace="errors"
                    translation={`${error}.text`}
                />

                <CustomButton
                    nameSpace="errors"
                    translation={`${error}.button`}
                    onClick={handleClose}
                    className={styles.button}
                    variant="custom-cancel"
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const MeetingErrorDialog = memo(Component);
