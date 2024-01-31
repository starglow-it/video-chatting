import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';

import { useCallback } from 'react';
import { useStore } from 'effector-react';
import { $appDialogsStore, appDialogsApi } from 'src/store';
import { AppDialogsEnum } from 'src/store/types';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { Translation } from '@library/common/Translation/Translation';
import {
    $meetingStore,
    answerRequestByAudienceEvent,
} from 'src/store/roomStores';
import { AnswerSwitchRoleAction } from 'shared-types';
import styles from './ConfirmBecomeParticipantDialog.module.scss';

export const ConfirmBecomeParticipantDialog = () => {
    const { confirmBecomeParticipantDialog } = useStore($appDialogsStore);
    const meeting = useStore($meetingStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmBecomeParticipantDialog,
        });
    }, []);

    const handleConfirmCancel = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmBecomeParticipantDialog,
        });
        answerRequestByAudienceEvent({
            action: AnswerSwitchRoleAction.Rejected,
            meetingId: meeting.id,
        });
    }, []);

    const handleConfirmBecomeParticipant = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmBecomeParticipantDialog,
        });
        answerRequestByAudienceEvent({
            action: AnswerSwitchRoleAction.Accept,
            meetingId: meeting.id,
        });
    }, []);

    return (
        <CustomDialog
            contentClassName={styles.content}
            open={confirmBecomeParticipantDialog}
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
