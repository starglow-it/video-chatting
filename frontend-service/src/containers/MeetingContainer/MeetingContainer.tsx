import React, {memo, useContext, useEffect, useState} from 'react';
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
import {MediaContext} from "../../contexts/MediaContext";

// stores
import {
    $localUserStore,
    $meetingTemplateStore,
    appDialogsApi,
    getMeetingTemplateFx,
    initiateSocketConnectionFx,
    joinMeetingEventWithData,
    joinRoomBeforeMeetingSocketEvent,
    resetLocalUserStore,
    resetMeetingStore,
    resetMeetingUsersStore,
    resetSocketStore,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    startMeeting,
    updateLocalUserEvent
} from '../../store';

// types
import {MeetingAccessStatuses} from '../../store/types';

// styles
import styles from './MeetingContainer.module.scss';

import {StorageKeysEnum, WebStorage} from "../../controllers/WebStorageController";

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

    const { actions: { onInitDevices }} = useContext(MediaContext);

    const [isMeetingReady, setIsMeetingReady] = useState(false);

    useEffect(() => {
        (async () => {
            await onInitDevices();
            const savedSettings = WebStorage.get<{ blurSetting: boolean; micActiveSetting: boolean; cameraActiveSetting: boolean; backgroundAudioVolumeSetting: number; backgroundAudioSetting: boolean }>({ key: StorageKeysEnum.meetingSettings });

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

            const meetingTemplate = await getMeetingTemplateFx({
                templateId: router.query.token as string,
            });

            await initiateSocketConnectionFx();

            if (meetingTemplate?.meetingInstance?.serverIp) {
                await joinMeetingEventWithData();

                if (Object.keys(savedSettings)?.length) {
                    startMeeting();
                }
            } else {
                await joinRoomBeforeMeetingSocketEvent({ templateId: router.query.token });
            }
            setIsMeetingReady(true);
        })();

        return () => {
            resetMeetingUsersStore();
            resetLocalUserStore();
            resetMeetingStore();
            resetSocketStore();
            appDialogsApi.resetDialogs();
        };
    }, []);

    return (
        <>
            {Boolean(meetingTemplate?.id) && (
                <VideoEffectsProvider>
                    {!isMeetingReady
                        ? null
                        : (
                            <>
                                {MeetingAccessStatuses.InMeeting !== meetingUser.accessStatus ? (
                                    <CustomBox className={styles.waitingRoomWrapper}>
                                        <MeetingPreview />
                                        <NotMeetingComponent />
                                    </CustomBox>
                                ) : (
                                    <MeetingView />
                                )}
                            </>
                        )
                    }
                </VideoEffectsProvider>
            )}
            <MeetingErrorDialog />
        </>
    );
});

export default MeetingContainer;
