import React, { memo, useEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// common
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { DevicesSettings } from '@components/DevicesSettings/DevicesSettings';
import { EnterMeetingName } from '@components/EnterMeetingName/EnterMeetingName';
import { KickedUser } from '@components/KickedUser/KickedUser';
import { Layout } from '@components/Layout/Layout';
import { MeetingView } from '@components/Meeting/MeetingView/MeetingView';
import { MeetingErrorDialog } from '@components/Dialogs/MeetingErrorDialog/MeetingErrorDialog';
import {VideoEffectsProvider} from "../../contexts/VideoEffectContext";

// stores
import { $localUserStore, resetLocalUserStore, resetMeetingUsersStore } from '../../store/users';
import { resetSocketStore } from '../../store/socket';
import { appDialogsApi } from '../../store/dialogs';
import {
    $meetingTemplateStore,
    resetMeetingInstanceStore,
    resetMeetingStore,
    getMeetingTemplateFx,
} from '../../store/meeting';

// types
import { MeetingAccessStatuses } from '../../store/types';

// styles
import styles from './MeetingContainer.module.scss';

import {initiateMainSocketConnectionFx, resetMainSocketStore} from "../../store/mainServerSocket";

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
            await initiateMainSocketConnectionFx();
            await getMeetingTemplateFx({ templateId: router.query.token as string });
        })();

        return () => {
            resetMeetingUsersStore();
            resetLocalUserStore();
            resetMeetingInstanceStore();
            resetMeetingStore();
            resetSocketStore();
            resetMainSocketStore();
            appDialogsApi.resetDialogs();
        };
    }, []);

    return (
        <Layout>
            {meetingTemplate.id && (
                <VideoEffectsProvider>
                    {![MeetingAccessStatuses.InMeeting].includes(meetingUser.accessStatus) ? (
                        <CustomBox className={styles.waitingRoomWrapper}>
                            <NotMeetingComponent />
                        </CustomBox>
                    ) : (
                        <MeetingView />
                    )}
                </VideoEffectsProvider>
            )}
            <MeetingErrorDialog />
        </Layout>
    );
});

export default MeetingContainer;
