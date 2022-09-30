import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// stores
import { appDialogsApi, $appDialogsStore, deleteMeetingFx } from '../../../store';
import {
    $isMeetingHostStore,
    $localUserStore,
    $meetingTemplateStore,
    disconnectFromVideoChatEvent,
    sendEndMeetingSocketEvent,
    sendLeaveMeetingSocketEvent,
} from '../../../store/roomStores';

// styles
import styles from './EndMeetingDialog.module.scss';

// types
import { AppDialogsEnum } from '../../../store/types';

// const
import { clientRoutes, dashboardRoute } from '../../../const/client-routes';

const Component = () => {
    const router = useRouter();
    const meetingTemplate = useStore($meetingTemplateStore);
    const isMeetingHost = useStore($isMeetingHostStore);
    const localUser = useStore($localUserStore);

    const { translation } = useLocalization('meeting');

    const { endMeetingDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.endMeetingDialog,
        });
    }, []);

    const handleLeave = useCallback(async () => {
        handleClose();
        disconnectFromVideoChatEvent();
        await sendLeaveMeetingSocketEvent();
        await router.push(localUser.isGenerated ? clientRoutes.welcomeRoute : dashboardRoute);
    }, [localUser.isGenerated]);

    const handleEndMeeting = useCallback(async () => {
        handleClose();
        disconnectFromVideoChatEvent();

        deleteMeetingFx({ templateId: meetingTemplate.id });

        await sendEndMeetingSocketEvent();

        await router.push(dashboardRoute);
    }, [meetingTemplate.id]);

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
                    __html: translation(`endMeeting.${isMeetingHost ? 'forHost' : 'forAttendee'}`),
                }}
            />
            <CustomGrid
                className={styles.buttonsWrapper}
                container
                justifyContent="center"
                alignItems="center"
            >
                {isMeetingHost ? (
                    <>
                        <CustomButton
                            onClick={handleLeave}
                            className={styles.baseBtn}
                            nameSpace="meeting"
                            translation="buttons.leave"
                            variant="custom-cancel"
                        />
                        <CustomButton
                            onClick={handleEndMeeting}
                            className={styles.baseBtn}
                            nameSpace="meeting"
                            translation="buttons.end"
                            variant="custom-error"
                        />
                    </>
                ) : (
                    <>
                        <CustomButton
                            onClick={handleClose}
                            className={styles.baseBtn}
                            nameSpace="meeting"
                            translation="buttons.cancel"
                            variant="custom-cancel"
                        />
                        <CustomButton
                            onClick={handleLeave}
                            className={styles.baseBtn}
                            nameSpace="common"
                            translation="buttons.leave"
                            variant="custom-error"
                        />
                    </>
                )}
            </CustomGrid>
        </CustomDialog>
    );
};

export const EndMeetingDialog = memo(Component);
