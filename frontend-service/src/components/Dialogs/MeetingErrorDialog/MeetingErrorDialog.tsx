import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { $appDialogsStore, appDialogsApi } from '../../../store';
import { $meetingErrorStore } from '../../../store';

import { AppDialogsEnum } from '../../../store/types';

import styles from './MeetingErrorDialog.module.scss';

const MeetingErrorDialog = memo(() => {
    const { meetingErrorDialog } = useStore($appDialogsStore);
    const error = useStore($meetingErrorStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.meetingErrorDialog,
        });
    }, []);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={meetingErrorDialog}
            onClose={handleClose}
            onBackdropClick={handleClose}
        >
            <CustomGrid container alignItems="center" direction="column">
                <CustomTypography
                    variant="h3bold"
                    nameSpace="errors"
                    translation="meeting.dialog.title"
                />
                <CustomTypography nameSpace="errors" translation={error} />
            </CustomGrid>
        </CustomDialog>
    );
});

export { MeetingErrorDialog };
