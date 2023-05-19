import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { WarningIcon } from 'shared-frontend/icons/OtherIcons/WarningIcon';

// custom
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';

// stores
import { Translation } from '@library/common/Translation/Translation';
import { $appDialogsStore, $authStore, appDialogsApi } from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './MeetingErrorDialog.module.scss';

// const
import { dashboardRoute, loginRoute } from '../../../const/client-routes';
import { $meetingErrorStore } from '../../../store/roomStores';

const Component = () => {
    const router = useRouter();

    const { meetingErrorDialog } = useStore($appDialogsStore);
    const error = useStore($meetingErrorStore);
    const { isWithoutAuthen } = useStore($authStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
        if (error === 'meeting.timeLimit') {
            router.push(isWithoutAuthen ? loginRoute : dashboardRoute);
        }
    }, [error]);

    const { isMobile } = useBrowserDetect();

    return (
        <CustomDialog
            className={clsx(styles.dialog, {
                [styles.mobile]: isMobile,
            })}
            contentClassName={clsx(styles.content, {
                [styles.mobile]: isMobile,
            })}
            open={meetingErrorDialog}
            onClose={handleClose}
            onBackdropClick={handleClose}
        >
            <CustomGrid container alignItems="center" direction="column">
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                >
                    <WarningIcon
                        className={styles.icon}
                        width="36px"
                        height="36px"
                    />
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
                    label={
                        <Translation
                            nameSpace="errors"
                            translation={`${error}.button`}
                        />
                    }
                    onClick={handleClose}
                    className={styles.button}
                    variant="custom-cancel"
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const MeetingErrorDialog = memo(Component);
