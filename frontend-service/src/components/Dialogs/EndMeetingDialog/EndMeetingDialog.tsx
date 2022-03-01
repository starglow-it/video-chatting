import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

import styles from './EndMeetingDialog.module.scss';

import { appDialogsApi, $appDialogsStore } from '../../../store/dialogs';

import { $meetingStore, emitEndMeetingEvent, emitLeaveMeetingEvent } from '../../../store/meeting';
import { $localUserStore } from '../../../store/users';

import { AppDialogsEnum } from '../../../store/types';
import { useLocalization } from '../../../hooks/useTranslation';

const EndMeetingDialog = memo(() => {
    const router = useRouter();
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);

    const { translation } = useLocalization('meeting');

    const { endMeetingDialog } = useStore($appDialogsStore);

    const isOwner = meeting.owner === localUser.id;

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.endMeetingDialog,
        });
    }, []);

    const handleLeave = useCallback(() => {
        handleClose();
        emitLeaveMeetingEvent();
        router.push(localUser.isGenerated ? '/login' : '/dashboard');
    }, []);

    const handleEndMeeting = useCallback(() => {
        handleClose();
        emitEndMeetingEvent();
        router.push('/dashboard');
    }, []);

    return (
        <CustomDialog
            contentClassName={styles.wrapper}
            open={endMeetingDialog}
            onClose={handleClose}
        >
            <CustomTypography
                className={styles.text}
                variant="h4"
                textAlign="center"
                dangerouslySetInnerHTML={{
                    __html: translation(`endMeeting.${isOwner ? 'forHost' : 'forAttendee'}`),
                }}
            />
            <CustomGrid
                className={styles.buttonsWrapper}
                container
                justifyContent="center"
                alignItems="center"
            >
                <CustomButton
                    onClick={handleLeave}
                    className={styles.baseBtn}
                    nameSpace="meeting"
                    translation="buttons.leave"
                    variant="custom-cancel"
                />
                {isOwner && (
                    <CustomButton
                        onClick={handleEndMeeting}
                        className={styles.baseBtn}
                        nameSpace="meeting"
                        translation="buttons.end"
                        variant="custom-primary"
                    />
                )}
            </CustomGrid>
        </CustomDialog>
    );
});

export { EndMeetingDialog };
