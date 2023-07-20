import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// stores
import { Translation } from '@library/common/Translation/Translation';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { appDialogsApi, $appDialogsStore } from '../../../store';
import {
    $isMeetingHostStore,
    $localUserStore,
    disconnectFromVideoChatEvent,
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

    const localUser = useStore($localUserStore);
    const isMeetingHost = useStore($isMeetingHostStore);

    const { translation } = useLocalization('meeting');

    const { endMeetingDialog } = useStore($appDialogsStore);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.endMeetingDialog,
        });
    }, []);

    const handleLeave = useCallback(async () => {
        handleClose();

        sendLeaveMeetingSocketEvent();

        disconnectFromVideoChatEvent();

        await router.push(
            localUser.isGenerated ? clientRoutes.welcomeRoute : dashboardRoute,
        );
    }, [localUser.isGenerated]);

    // const handleEndMeeting = useCallback(async () => {
    //     handleClose();
    //     sendEndMeetingSocketEvent();
    //
    // 	disconnectFromVideoChatEvent();
    //
    // 	await router.push(dashboardRoute);
    // }, [meetingTemplate.id]);

    return (
        <CustomDialog
            contentClassName={styles.wrapper}
            open={endMeetingDialog}
            onClose={handleClose}
        >
            <CustomTypography
                className={styles.text}
                variant="h4bold"
                textAlign="center"
                dangerouslySetInnerHTML={{
                    __html: translation(`endMeeting.forAttendee`),
                }}
            />
            <ConditionalRender condition={isMeetingHost}>
                <CustomTypography
                    className={styles.hint}
                    textAlign="center"
                    nameSpace="meeting"
                    translation="endMeeting.hint"
                />
            </ConditionalRender>
            <CustomGrid
                className={styles.buttonsWrapper}
                container
                justifyContent="center"
                alignItems="center"
                gap={2}
            >
                <CustomButton
                    onClick={handleClose}
                    className={styles.baseBtn}
                    label={
                        <Translation
                            nameSpace="meeting"
                            translation="buttons.cancel"
                        />
                    }
                    variant="custom-error"
                />
                <CustomButton
                    onClick={handleLeave}
                    className={styles.leaveButton}
                    label={
                        <Translation
                            nameSpace="common"
                            translation="buttons.leave"
                        />
                    }
                />
            </CustomGrid>
        </CustomDialog>
    );
};

export const EndMeetingDialog = memo(Component);
