import React, { memo, useContext, useEffect, useLayoutEffect} from 'react';
import {useStore} from 'effector-react';
import {useRouter} from 'next/router';

// common
import {CustomBox} from '@library/custom/CustomBox/CustomBox';

// components
import {EnterMeetingName} from '@components/EnterMeetingName/EnterMeetingName';
import {KickedUser} from '@components/KickedUser/KickedUser';
import {MeetingView} from '@components/Meeting/MeetingView/MeetingView';
import {MeetingErrorDialog} from '@components/Dialogs/MeetingErrorDialog/MeetingErrorDialog';
import {VideoEffectsProvider} from '../../contexts/VideoEffectContext';
import {MeetingPreview} from '@components/Meeting/MeetingPreview/MeetingPreview';
import {DevicesSettings} from '@components/DevicesSettings/DevicesSettings';
import {MediaContext} from '../../contexts/MediaContext';

// stores
import {
    $localUserStore,
    $meetingTemplateStore,
    appDialogsApi,
    getMeetingTemplateFx,
    joinMeetingEventWithData,
    joinRoomBeforeMeetingSocketEvent,
    resetLocalUserStore,
    resetMeetingStore,
    resetMeetingUsersStore,
    resetSocketStore,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    startMeeting,
    updateLocalUserEvent,
    initiateSocketConnectionEvent,
    $isSocketConnected,
    initWindowListeners,
    removeWindowListeners,
    $isOwner
} from '../../store';

// types
import {MeetingAccessStatuses} from '../../store/types';

// styles
import styles from './MeetingContainer.module.scss';

import {StorageKeysEnum, WebStorage} from '../../controllers/WebStorageController';
import {
    getSubscriptionWithDataFx
} from "../../store";
import {useSubscriptionNotification} from "../../hooks/useSubscriptionNotification";

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
        }
    }, []);

    useSubscriptionNotification();

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
        })()
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
