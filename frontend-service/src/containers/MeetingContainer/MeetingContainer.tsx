import React, { memo, useContext, useEffect, useLayoutEffect } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// hooks
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';

// common
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { EnterMeetingName } from '@components/EnterMeetingName/EnterMeetingName';
import { KickedUser } from '@components/KickedUser/KickedUser';
import { MeetingView } from '@components/Meeting/MeetingView/MeetingView';
import { MeetingErrorDialog } from '@components/Dialogs/MeetingErrorDialog/MeetingErrorDialog';
import { MeetingPreview } from '@components/Meeting/MeetingPreview/MeetingPreview';
import { DevicesSettings } from '@components/DevicesSettings/DevicesSettings';
import { TimeLimitNotification } from '@components/TimeLimitNotification/TimeLimitNotification';
import { MediaContext } from '../../contexts/MediaContext';
import { VideoEffectsProvider } from '../../contexts/VideoEffectContext';

// stores
import {
    $localUserStore,
    $meetingTemplateStore,
    $isOwner,
    $isSocketConnected,
    getMeetingTemplateFx,
    joinMeetingEventWithData,
    joinRoomBeforeMeetingSocketEvent,
    startMeeting,
    getSubscriptionWithDataFx,
    appDialogsApi,
    resetLocalUserStore,
    resetMeetingStore,
    resetMeetingUsersStore,
    resetSocketStore,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    updateLocalUserEvent,
    initiateSocketConnectionEvent,
    initWindowListeners,
    removeWindowListeners,
    resetMeetingTemplateStoreEvent,
} from '../../store';

// types
import { MeetingAccessStatuses } from '../../store/types';

// styles
import styles from './MeetingContainer.module.scss';

import { StorageKeysEnum, WebStorage } from '../../controllers/WebStorageController';
import { getClientMeetingUrl } from '../../utils/urls';

const NotMeetingComponent = memo(() => {
    const meetingUser = useStore($localUserStore);

    if (meetingUser.accessStatus === MeetingAccessStatuses.EnterName) {
        return <EnterMeetingName />;
    }
    if (meetingUser.accessStatus === MeetingAccessStatuses.Kicked) {
        return <KickedUser />;
    }

    return <DevicesSettings />;
});

const MeetingContainer = memo(() => {
    const router = useRouter();

    const meetingUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isOwner = useStore($isOwner);
    const isSocketConnected = useStore($isSocketConnected);

    const {
        actions: { onInitDevices },
    } = useContext(MediaContext);

    useEffect(() => {
        getSubscriptionWithDataFx();
    }, []);

    useLayoutEffect(() => {
        initWindowListeners();

        return () => {
            removeWindowListeners();
        };
    }, []);

    useSubscriptionNotification(getClientMeetingUrl(router.query.token));

    useEffect(() => {
        (async () => {
            getMeetingTemplateFx({
                templateId: router.query.token as string,
            });

            initiateSocketConnectionEvent();

            await onInitDevices();
        })();

        return () => {
            resetMeetingUsersStore();
            resetLocalUserStore();
            resetMeetingStore();
            resetSocketStore();
            resetMeetingTemplateStoreEvent();
            appDialogsApi.resetDialogs();
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (isSocketConnected) {
                const savedSettings = WebStorage.get<{
                    blurSetting: boolean;
                    micActiveSetting: boolean;
                    cameraActiveSetting: boolean;
                    backgroundAudioVolumeSetting: number;
                    backgroundAudioSetting: boolean;
                }>({ key: StorageKeysEnum.meetingSettings });

                if (Object.keys(savedSettings)?.length) {
                    setBackgroundAudioVolume(savedSettings.backgroundAudioVolumeSetting);
                    setBackgroundAudioActive(savedSettings.backgroundAudioSetting);

                    updateLocalUserEvent({
                        accessStatus: MeetingAccessStatuses.InMeeting,
                        isAuraActive: savedSettings.blurSetting,
                        cameraStatus: savedSettings.cameraActiveSetting ? 'active' : 'inactive',
                        micStatus: savedSettings.micActiveSetting ? 'active' : 'inactive',
                    });
                }

                if (meetingTemplate?.meetingInstance?.serverIp) {
                    await joinMeetingEventWithData();

                    if (Object.keys(savedSettings)?.length && isOwner) {
                        startMeeting();
                    }
                } else {
                    await joinRoomBeforeMeetingSocketEvent({ templateId: router.query.token });
                }
            }
        })();
    }, [meetingTemplate?.meetingInstance?.serverIp, isSocketConnected, isOwner]);

    return (
        <>
            {Boolean(meetingTemplate?.id) && (
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
