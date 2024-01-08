import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';

import { useEffect, useCallback } from 'react';
import { useStore } from 'effector-react';
import { $appDialogsStore, appDialogsApi } from 'src/store';
import { AppDialogsEnum } from 'src/store/types';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { Translation } from '@library/common/Translation/Translation';
import {
    $meetingStore,
    answerRequestFromParticipantToAudienceByParticipantEvent
} from 'src/store/roomStores';
import { AnswerSwitchRoleAction } from 'shared-types';
import styles from './ConfirmBecomeAudienceDialog.module.scss';

export const ConfirmBecomeAudienceDialog = () => {
    const { confirmBecomeAudienceDialog } = useStore($appDialogsStore);
    const meeting = useStore($meetingStore);

    useEffect(() => {
        if (confirmBecomeAudienceDialog) {
            answerRequestFromParticipantToAudienceByParticipantEvent({
                action: AnswerSwitchRoleAction.Accept,
                meetingId: meeting.id,
            });
        }

        return () => appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmBecomeAudienceDialog,
        });
    }, [confirmBecomeAudienceDialog]);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmBecomeAudienceDialog,
        });
    }, []);

    const handleConfirmCancel = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmBecomeAudienceDialog,
        });
        answerRequestFromParticipantToAudienceByParticipantEvent({
            action: AnswerSwitchRoleAction.Rejected,
            meetingId: meeting.id,
        });
    }, []);

    const handleConfirmBecomeParticipant = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmBecomeAudienceDialog,
        });
        answerRequestFromParticipantToAudienceByParticipantEvent({
            action: AnswerSwitchRoleAction.Accept,
            meetingId: meeting.id,
        });
    }, []);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={confirmBecomeAudienceDialog}
            onBackdropClick={handleClose}
            onClose={handleClose}
        >
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
            >
                <CustomTypography
                    variant="h4bold"
                    nameSpace="meeting"
                    translation="templates.becomeParticipant.title"
                />
                <CustomTypography
                    className={styles.text}
                    nameSpace="meeting"
                    translation="templates.becomeParticipant.text"
                />
                <CustomGrid container wrap="nowrap" gap={2}>
                    <CustomButton
                        variant="custom-cancel"
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="buttons.cancel"
                            />
                        }
                        onClick={handleConfirmCancel}
                    />
                    <CustomButton
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="buttons.yes"
                            />
                        }
                        onClick={handleConfirmBecomeParticipant}
                    />
                </CustomGrid>
            </CustomGrid>
        </CustomDialog>
    );
};
