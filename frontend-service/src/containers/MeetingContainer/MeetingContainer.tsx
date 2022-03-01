import React, { memo, useEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

import { CustomBox } from '@library/custom/CustomBox/CustomBox';

import { DevicesSettings } from '@components/DevicesSettings/DevicesSettings';
import { EnterMeetingName } from '@components/EnterMeetingName/EnterMeetingName';
import { KickedUser } from '@components/KickedUser/KickedUser';
import { Layout } from '@components/Layout/Layout';
import { MeetingView } from '@components/Meeting/MeetingView/MeetingView';
import { MeetingErrorDialog } from '@components/Dialogs/MeetingErrorDialog/MeetingErrorDialog';

import { $localUserStore, resetLocalUserStore, resetMeetingUsersStore } from '../../store/users';
import { initiateSocketConnectionFx, resetSocketStore } from '../../store/socket';
import { appDialogsApi } from '../../store/dialogs';
import {
    $meetingTemplateStore,
    $meetingInstanceStore,
    resetMeetingInstanceStore,
    resetMeetingStore,
    getMeetingTemplateFx,
    fetchMeetingInstanceFx,
    emitJoinMeetingEvent,
    $meetingStore,
} from '../../store/meeting';

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
    const meetingInstance = useStore($meetingInstanceStore);
    const meeting = useStore($meetingStore);

    useEffect(() => {
        (async () => {
            const { meeting } = await fetchMeetingInstanceFx({
                meetingId: router.query.token as string,
            });

            await initiateSocketConnectionFx({ serverIp: meeting.serverIp });

            emitJoinMeetingEvent();
        })();

        return () => {
            resetMeetingUsersStore();
            resetLocalUserStore();
            resetMeetingInstanceStore();
            resetMeetingStore();
            resetSocketStore();
            appDialogsApi.resetDialogs();
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (meeting.ownerProfileId && meetingInstance?.template) {
                await getMeetingTemplateFx({ templateId: meetingInstance?.template });
            }
        })();
    }, [meeting.ownerProfileId, meetingInstance?.template]);

    return (
        <Layout>
            {meetingTemplate.id && meetingInstance.id && (
                <>
                    {![MeetingAccessStatuses.InMeeting].includes(meetingUser.accessStatus) ? (
                        <CustomBox className={styles.waitingRoomWrapper}>
                            <NotMeetingComponent />
                        </CustomBox>
                    ) : (
                        <MeetingView />
                    )}
                </>
            )}
            <MeetingErrorDialog />
        </Layout>
    );
});

export default MeetingContainer;
