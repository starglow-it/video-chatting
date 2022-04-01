import React, { memo, useEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// common
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { DevicesSettings } from '@components/DevicesSettings/DevicesSettings';
import { EnterMeetingName } from '@components/EnterMeetingName/EnterMeetingName';
import { KickedUser } from '@components/KickedUser/KickedUser';
import { MeetingView } from '@components/Meeting/MeetingView/MeetingView';
import { MeetingErrorDialog } from '@components/Dialogs/MeetingErrorDialog/MeetingErrorDialog';
import {VideoEffectsProvider} from "../../contexts/VideoEffectContext";
import {MeetingPreview} from "@components/Meeting/MeetingPreview/MeetingPreview";

// stores
import { $localUserStore, resetLocalUserStore, resetMeetingUsersStore } from '../../store/users';
import {initiateSocketConnectionFx, resetSocketStore } from '../../store/socket';
import {
    disconnectMainSocketEvent,
    initiateMainSocketConnectionFx,
    resetMainSocketStore
} from "../../store/mainServerSocket";
import { appDialogsApi } from '../../store/dialogs';
import {
    $meetingTemplateStore,
    resetMeetingStore,
    emitJoinMeetingEvent,
    getMeetingTemplateFx,
} from '../../store/meeting';
import { joinRoomBeforeMeeting, sendMeetingAvailable } from "../../store/waitingRoom";

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

    useEffect(() => {
        (async () => {
            const meetingTemplate = await getMeetingTemplateFx({ templateId: router.query.token as string });

            if (meetingTemplate?.meetingInstance?.serverIp) {
                await initiateSocketConnectionFx({ serverIp: meetingTemplate.meetingInstance.serverIp! });

                emitJoinMeetingEvent();

                await sendMeetingAvailable({ templateId: router.query.token });
            } else {
                await initiateMainSocketConnectionFx();

                await joinRoomBeforeMeeting({ templateId: router.query.token });
            }
        })();

        return () => {
            disconnectMainSocketEvent();
            resetMeetingUsersStore();
            resetLocalUserStore();
            resetMeetingStore();
            resetSocketStore();
            resetMainSocketStore();
            appDialogsApi.resetDialogs();
        };
    }, []);

    return (
        <>
            {meetingTemplate.id && (
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
