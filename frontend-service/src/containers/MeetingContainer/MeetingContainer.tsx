import React, { memo, useContext, useEffect, useLayoutEffect, useState } from 'react';
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
import { MediaContext } from '../../contexts/MediaContext';
import { VideoEffectsProvider } from '../../contexts/VideoEffectContext';

// stores
import {
    $localUserStore,
    $meetingTemplateStore,
    $isOwner,
    $isSocketConnected,
    getMeetingTemplateFx,
    sendJoinMeetingEventSocketEvent,
    joinRoomBeforeMeetingSocketEvent,
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
    sendStartMeetingSocketEvent,
} from '../../store';

// types
import { MeetingAccessStatuses } from '../../store/types';

// styles
import styles from './MeetingContainer.module.scss';

import { StorageKeysEnum, WebStorage } from '../../controllers/WebStorageController';
import { getClientMeetingUrl } from '../../utils/urls';
import { setTimeLimitWarningEvent } from '../../store/roomStores';

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

    const [startMeeting, setStartMeeting] = useState(false);

    const {
        actions: { onInitDevices, onClearCurrentDevices },
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

    useSubscriptionNotification(getClientMeetingUrl(router.query.token as string));

    useEffect(() => {
        (async () => {
            getMeetingTemplateFx({
                templateId: router.query.token as string,
            });

            initiateSocketConnectionEvent();
        })();

        return () => {
            resetMeetingUsersStore();
            resetLocalUserStore();
            resetMeetingStore();
            resetSocketStore();
            resetMeetingTemplateStoreEvent();
            setTimeLimitWarningEvent(false);
            appDialogsApi.resetDialogs();
            onClearCurrentDevices();
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (isSocketConnected) {
                await onInitDevices();

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
                }

                if (meetingTemplate?.meetingInstance?.serverIp) {
                    await sendJoinMeetingEventSocketEvent();

                    if (Object.keys(savedSettings)?.length && isOwner) {
                        updateLocalUserEvent({
                            isAuraActive: savedSettings.blurSetting,
                            cameraStatus: savedSettings.cameraActiveSetting ? 'active' : 'inactive',
                            micStatus: savedSettings.micActiveSetting ? 'active' : 'inactive',
                        });

                        await sendStartMeetingSocketEvent();
                    }
                } else {
                    await joinRoomBeforeMeetingSocketEvent({
                        templateId: router.query.token as string,
                    });
                }
                setStartMeeting(true);
            }
        })();
    }, [meetingTemplate?.meetingInstance?.serverIp, isSocketConnected, isOwner]);

    return (
        <>
            {Boolean(meetingTemplate?.id) && isSocketConnected && startMeeting && (
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
