import React, { memo, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

// hooks
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// common
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { EnterMeetingName } from '@components/EnterMeetingName/EnterMeetingName';
import { KickedUser } from '@components/KickedUser/KickedUser';
import { MeetingErrorDialog } from '@components/Dialogs/MeetingErrorDialog/MeetingErrorDialog';
import { MeetingPreview } from '@components/Meeting/MeetingPreview/MeetingPreview';
import { DevicesSettings } from '@components/DevicesSettings/DevicesSettings';
import { HostTimeExpiredDialog } from '@components/Dialogs/HostTimeExpiredDialog/HostTimeExpiredDialog';
import { MeetingView } from '@components/Meeting/MeetingView/MeetingView';

// stores
import { useToggle } from '@hooks/useToggle';
import { MeetingAccessStatusEnum } from 'shared-types';
import {
    appDialogsApi,
    getSubscriptionWithDataFx,
    initLandscapeListener,
    initWindowListeners,
    removeLandscapeListener,
    removeWindowListeners,
    resetRoomStores,
} from '../../store';
import {
    $isMeetingSocketConnected,
    $isMeetingSocketConnecting,
    $isOwner,
    $localUserStore,
    $meetingTemplateStore,
    getMeetingTemplateFx,
    initDevicesEventFxWithStore,
    initiateMeetingSocketConnectionEvent,
    joinMeetingEvent,
    joinRoomBeforeMeetingSocketEvent,
    sendJoinWaitingRoomSocketEvent,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    setCurrentAudioDeviceEvent,
    setCurrentVideoDeviceEvent,
    setIsAudioActiveEvent,
    setIsAuraActive,
    setIsCameraActiveEvent,
    updateLocalUserEvent,
} from '../../store/roomStores';

// types
import { SavedSettings } from '../../types';

// styles
import styles from './MeetingContainer.module.scss';

// utils
import { StorageKeysEnum, WebStorage } from '../../controllers/WebStorageController';
import { getClientMeetingUrl } from '../../utils/urls';
import { BackgroundManager } from '../../helpers/media/applyBlur';

const NotMeetingComponent = memo(() => {
    const localUser = useStore($localUserStore);

    const ChildComponent = useMemo(() => {
        if (localUser.accessStatus === MeetingAccessStatusEnum.EnterName) {
            return EnterMeetingName;
        }
        if (localUser.accessStatus === MeetingAccessStatusEnum.Kicked) {
            return KickedUser;
        }

        return DevicesSettings;
    }, [localUser.accessStatus]);

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomScroll className={styles.scroll}>
                <CustomGrid container direction="column" wrap="nowrap">
                    <ChildComponent />
                </CustomGrid>
            </CustomScroll>
        </CustomPaper>
    );
});

const MeetingContainer = memo(() => {
    const router = useRouter();

    const localUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isOwner = useStore($isOwner);
    const isMeetingSocketConnected = useStore($isMeetingSocketConnected);
    const isMeetingSocketConnecting = useStore($isMeetingSocketConnecting);

    const { isMobile } = useBrowserDetect();

    const { value:
        isSettingsChecked,
        onSwitchOn: handleSetSettingsChecked
    } = useToggle(false);

    useEffect(() => {
        initWindowListeners();
        initLandscapeListener();

        return () => {
            removeWindowListeners();
            removeLandscapeListener();
        };
    }, []);

    useSubscriptionNotification(getClientMeetingUrl(router.query.token as string));

    useEffect(() => {
        (async () => {
            getSubscriptionWithDataFx();

            await getMeetingTemplateFx({
                templateId: router.query.token as string,
            });

            updateLocalUserEvent({
                accessStatus: MeetingAccessStatusEnum.EnterName,
            });
        })();

        return () => {
            resetRoomStores();

            BackgroundManager.destroy();

            appDialogsApi.resetDialogs();
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (meetingTemplate?.meetingInstance?.serverStatus === 'inactive') {
                joinRoomBeforeMeetingSocketEvent({
                    templateId: meetingTemplate.id,
                });
            }
        })();
    }, [meetingTemplate?.meetingInstance]);

    useEffect(() => {
        if (
            meetingTemplate?.meetingInstance?.serverIp &&
            meetingTemplate.meetingInstance.serverStatus === 'active' &&
            !isMeetingSocketConnecting
        ) {
            initiateMeetingSocketConnectionEvent();
        }
    }, [meetingTemplate?.meetingInstance, isMeetingSocketConnecting]);

    useEffect(() => {
        (async () => {
            const savedSettings = WebStorage.get<SavedSettings>({
                key: StorageKeysEnum.meetingSettings,
            });

            if (Object.keys(savedSettings)?.length) {
                setBackgroundAudioVolume(savedSettings.backgroundAudioVolumeSetting);
                setBackgroundAudioActive(savedSettings.backgroundAudioSetting);
                setIsAuraActive(savedSettings.auraSetting);
                setIsCameraActiveEvent(savedSettings.cameraActiveSetting);
                setIsAudioActiveEvent(savedSettings.micActiveSetting);
                setCurrentAudioDeviceEvent(savedSettings.savedAudioDeviceId);
                setCurrentVideoDeviceEvent(savedSettings.savedVideoDeviceId);
            }

            if (isMeetingSocketConnected) {
                await initDevicesEventFxWithStore();

                await sendJoinWaitingRoomSocketEvent();

                if (Object.keys(savedSettings)?.length && isOwner) {
                    updateLocalUserEvent({
                        isAuraActive: savedSettings.auraSetting,
                        accessStatus: MeetingAccessStatusEnum.InMeeting,
                    });

                    joinMeetingEvent({
                        isSettingsAudioBackgroundActive: savedSettings.backgroundAudioSetting,
                        settingsBackgroundAudioVolume: savedSettings.backgroundAudioVolumeSetting,
                        needToRememberSettings: false,
                    });
                }

                handleSetSettingsChecked();
            }
        })();
    }, [isMeetingSocketConnected, isOwner]);

    return (
        <>
            {Boolean(meetingTemplate?.id) && (
                <ConditionalRender condition={isSettingsChecked}>
                    <ConditionalRender
                        condition={MeetingAccessStatusEnum.InMeeting !== localUser.accessStatus}
                    >
                        <CustomBox
                            className={clsx(styles.waitingRoomWrapper, {
                                [styles.mobile]: isMobile,
                            })}
                        >
                            <MeetingPreview />
                            <NotMeetingComponent />
                        </CustomBox>
                    </ConditionalRender>
                    <ConditionalRender
                        condition={localUser.accessStatus === MeetingAccessStatusEnum.InMeeting}
                    >
                        <MeetingView />
                    </ConditionalRender>
                </ConditionalRender>
            )}
            <HostTimeExpiredDialog />
            <MeetingErrorDialog />
        </>
    );
});

export default MeetingContainer;
