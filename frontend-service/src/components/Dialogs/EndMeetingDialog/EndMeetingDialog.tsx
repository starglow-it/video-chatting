
import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

import {
    deleteMeetingFx,
    appDialogsApi,
    $appDialogsStore,
    $isOwner,
    $meetingTemplateStore,
    emitEndMeetingEvent,
    emitLeaveMeetingEvent,
    $localUserStore
} from 'src/store';
import styles from './EndMeetingDialog.module.scss';

import { AppDialogsEnum } from '../../../store/types';
import { useLocalization } from '../../../hooks/useTranslation';

const EndMeetingDialog = memo(() => {
    const router = useRouter();
    const meetingTemplate = useStore($meetingTemplateStore);
    const isOwner = useStore($isOwner);
    const localUser = useStore($localUserStore);

    const { translation } = useLocalization('meeting');

    const { endMeetingDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.endMeetingDialog,
        });
    }, []);

    const handleLeave = useCallback(() => {
        handleClose();
        emitLeaveMeetingEvent();
        router.push(localUser.isGenerated ? '/welcome' : '/dashboard');
    }, [localUser.isGenerated]);

    const handleEndMeeting = useCallback(async () => {
        handleClose();
        emitEndMeetingEvent();
        await deleteMeetingFx({ templateId: meetingTemplate.id });
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
