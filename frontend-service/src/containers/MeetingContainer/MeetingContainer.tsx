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
import {
    $localUserStore,
    joinRoomBeforeMeetingSocketEvent,
    resetLocalUserStore,
    resetMeetingUsersStore, setBackgroundAudioActive
} from '../../store';
import { initiateSocketConnectionFx, resetSocketStore } from '../../store';
import { appDialogsApi } from '../../store';
import {
    $meetingTemplateStore,
    resetMeetingStore,
    getMeetingTemplateFx,
    joinMeetingEventWithData,
} from '../../store';

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
            const meetingTemplate = await getMeetingTemplateFx({
                templateId: router.query.token as string,
            });

            await initiateSocketConnectionFx();

            if (meetingTemplate?.meetingInstance?.serverIp) {
                await joinMeetingEventWithData({});
            } else {
                await joinRoomBeforeMeetingSocketEvent({ templateId: router.query.token });
            }
        })();

        return () => {
            resetMeetingUsersStore();
            resetLocalUserStore();
            resetMeetingStore();
            resetSocketStore();
            setBackgroundAudioActive(false);
            appDialogsApi.resetDialogs();
        };
    }, []);

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
