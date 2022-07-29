import React, {memo, useContext, useEffect} from 'react';
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
    $meetingTemplateStore, $profileStore,
    addNotificationEvent,
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
    $isSocketConnected
} from '../../store';

// types
import {MeetingAccessStatuses, NotificationType} from '../../store/types';

// styles
import styles from './MeetingContainer.module.scss';

import {StorageKeysEnum, WebStorage} from '../../controllers/WebStorageController';
import {
    $subscriptionStore,
    getSubscriptionWithDataFx
} from "../../store";

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
    const subscription = useStore($subscriptionStore);
    const profile = useStore($profileStore);
    const isSocketConnected = useStore($isSocketConnected);

    const {
        actions: { onInitDevices },
    } = useContext(MediaContext);

    useEffect(() => {
        getSubscriptionWithDataFx();
    }, []);

    useEffect(() => {
        if (subscription?.id) {
            const planName = profile.subscriptionPlanKey;

            if (router.query.success === "true" && router.query.session_id) {
                router.push(`/meeting/${router.query.token}`, `/meeting/${router.query.token}`, { shallow: true });

                addNotificationEvent({
                    type: NotificationType.SubscriptionSuccess,
                    message: `subscriptions.subscription${planName}Success`,
                    withSuccessIcon: true,
                });
            }
        }
    }, [subscription?.id]);

    useEffect(() => {
        (async () => {
            await onInitDevices();

            await getMeetingTemplateFx({
                templateId: router.query.token as string,
            });

            initiateSocketConnectionEvent();
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

                    if (Object.keys(savedSettings)?.length) {
                        startMeeting();
                    }
                } else {
                    await joinRoomBeforeMeetingSocketEvent({ templateId: router.query.token });
                }
            }
        })()
    }, [meetingTemplate?.meetingInstance?.serverIp, isSocketConnected]);

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
