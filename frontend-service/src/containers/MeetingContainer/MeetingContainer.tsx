import React, { memo, useEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// common
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { EnterMeetingName } from '@components/EnterMeetingName/EnterMeetingName';
import { KickedUser } from '@components/KickedUser/KickedUser';
import { MeetingView } from '@components/Meeting/MeetingView/MeetingView';
import { MeetingErrorDialog } from '@components/Dialogs/MeetingErrorDialog/MeetingErrorDialog';
import { VideoEffectsProvider } from '../../contexts/VideoEffectContext';
import { MeetingPreview } from '@components/Meeting/MeetingPreview/MeetingPreview';
import { DevicesSettings } from '@components/DevicesSettings/DevicesSettings';

// stores
import { $localUserStore, resetLocalUserStore, resetMeetingUsersStore } from '../../store/users';
import { initiateSocketConnectionFx, resetSocketStore } from '../../store/socket';
import { appDialogsApi } from '../../store/dialogs';
import {
    $meetingTemplateStore,
    $isOwner,
    $isUserSendEnterRequest,
    resetMeetingStore,
    getMeetingTemplateFx,
    joinMeetingEventWithData,
    emitEnterMeetingEvent,
} from '../../store/meeting';
import { joinRoomBeforeMeeting, sendMeetingAvailable } from '../../store/waitingRoom';

// types
import { MeetingAccessStatuses } from '../../store/types';

// styles
import styles from './MeetingContainer.module.scss';

const NotMeetingComponent = memo(() => {
    const meetingUser = useStore($localUserStore);

    if (meetingUser.accessStatus === MeetingAccessStatuses.EnterName) {
        return <EnterMeetingName />;
    } else if (meetingUser.accessStatus === MeetingAccessStatuses.Kicked) {
        return <KickedUser />;
    } else {
        return <DevicesSettings />;
    }
});

const MeetingContainer = memo(() => {
    const router = useRouter();

    const meetingUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isOwner = useStore($isOwner);
    const isUserSentEnterRequest = useStore($isUserSendEnterRequest);

    useEffect(() => {
        (async () => {
            const meetingTemplate = await getMeetingTemplateFx({
                templateId: router.query.token as string,
            });

            await initiateSocketConnectionFx();

            if (meetingTemplate?.meetingInstance?.serverIp) {
                await joinMeetingEventWithData({});

                if (isOwner) await sendMeetingAvailable({ templateId: router.query.token });
            } else {
                await joinRoomBeforeMeeting({ templateId: router.query.token });
            }
        })();

        return () => {
            resetMeetingUsersStore();
            resetLocalUserStore();
            resetMeetingStore();
            resetSocketStore();
            appDialogsApi.resetDialogs();
        };
    }, []);

    useEffect(() => {
        if (
            meetingUser.accessStatus === MeetingAccessStatuses.Waiting &&
            meetingTemplate?.meetingInstance?.serverIp &&
            meetingUser.id &&
            !isOwner &&
            isUserSentEnterRequest
        ) {
            emitEnterMeetingEvent();
        }
    }, [meetingUser.accessStatus, meetingTemplate?.meetingInstance?.serverIp, isOwner, isUserSentEnterRequest]);

    return (
        <>
            {meetingTemplate?.id && (
                <VideoEffectsProvider>
                    {MeetingAccessStatuses.InMeeting !== meetingUser.accessStatus ? (
                        <CustomBox className={styles.waitingRoomWrapper}>
                            <MeetingPreview />
                            <NotMeetingComponent />
                        </CustomBox>
                    ) : (
                        <MeetingView />
                    )}
                </VideoEffectsProvider>
            )}
            <MeetingErrorDialog />
        </>
    );
});

export default MeetingContainer;
