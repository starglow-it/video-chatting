import { memo, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

// hooks
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// common
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

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
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { MeetingBackgroundVideo } from '@components/Meeting/MeetingBackgroundVideo/MeetingBackgroundVideo';
import { Typography } from '@mui/material';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { getAvatarsMeetingEvent } from 'src/store/roomStores/meeting/meetingAvatar/init';
import {
    getSubscriptionWithDataFx,
    initLandscapeListener,
    initWindowListeners,
    removeLandscapeListener,
    removeWindowListeners,
    resetRoomStores,
} from '../../store';
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    $isMeetingSocketConnected,
    $isMeetingSocketConnecting,
    $isOwner,
    $localUserStore,
    $meetingTemplateStore,
    getMeetingTemplateFx,
    initDevicesEventFxWithStore,
    initiateMeetingSocketConnectionEvent,
    joinMeetingEvent,
    joinMeetingFx,
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
import {
    StorageKeysEnum,
    WebStorage,
} from '../../controllers/WebStorageController';
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
        <CustomPaper className={styles.wrapper} id="anchor-1">
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
    const isJoinMeetingPending = useStore(joinMeetingFx.pending);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);

    const { isMobile } = useBrowserDetect();

    const { value: isSettingsChecked, onSwitchOn: handleSetSettingsChecked } =
        useToggle(false);

    useEffect(() => {
        initWindowListeners();
        initLandscapeListener();

        return () => {
            removeWindowListeners();
            removeLandscapeListener();
        };
    }, []);

    useSubscriptionNotification(
        getClientMeetingUrl(router.query.token as string),
    );

    useEffect(() => {
        (async () => {
            BackgroundManager.init();

            getSubscriptionWithDataFx({ subscriptionId: '' });

            await getMeetingTemplateFx({
                templateId: router.query.token as string,
                subdomain: isSubdomain() ? window.location.origin : undefined,
            });

            updateLocalUserEvent({
                accessStatus: MeetingAccessStatusEnum.EnterName,
            });
        })();

        return () => {
            resetRoomStores();

            BackgroundManager.destroy();
        };
    }, []);

    useEffect(() => {
        getAvatarsMeetingEvent();
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
            const isHasSettings = Object.keys(savedSettings)?.length;

            if (isHasSettings) {
                setBackgroundAudioVolume(
                    savedSettings.backgroundAudioVolumeSetting,
                );
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
                if (isOwner) {
                    if (isHasSettings) {
                        updateLocalUserEvent({
                            isAuraActive: savedSettings.auraSetting,
                            accessStatus: MeetingAccessStatusEnum.InMeeting,
                        });
                        joinMeetingEvent({
                            isSettingsAudioBackgroundActive:
                                savedSettings.backgroundAudioSetting,
                            settingsBackgroundAudioVolume:
                                savedSettings.backgroundAudioVolumeSetting,
                            needToRememberSettings: false,
                        });
                    } else {
                        updateLocalUserEvent({
                            accessStatus: MeetingAccessStatusEnum.InMeeting,
                        });
                        joinMeetingEvent({
                            isSettingsAudioBackgroundActive:
                                isBackgroundAudioActive,
                            settingsBackgroundAudioVolume:
                                backgroundAudioVolume,
                            needToRememberSettings: true,
                        });
                    }
                }
            }

            handleSetSettingsChecked();
        })();
    }, [isMeetingSocketConnected, isOwner]);

    const LoadingWaitingRoom = useMemo(() => {
        return (
            <CustomGrid className={styles.loadingRoom}>
                <CustomGrid className={styles.loadingWrapper}>
                    <Typography className={styles.loadingText}>
                        We&apos;re setting up your Room
                    </Typography>
                    <div className={styles.lds}>
                        <div />
                        <div />
                        <div />
                    </div>
                </CustomGrid>
            </CustomGrid>
        );
    }, []);

    return (
        <>
            <ConditionalRender
                condition={!!meetingTemplate.url && isSettingsChecked}
            >
                <MeetingBackgroundVideo
                    templateType={meetingTemplate.templateType}
                    src={meetingTemplate.url}
                    videoClassName={styles.wrapperBackgroundMedia}
                >
                    <CustomImage
                        src={meetingTemplate.url || ''}
                        className={styles.wrapperBackgroundMedia}
                        layout="fill"
                    />
                </MeetingBackgroundVideo>
            </ConditionalRender>
            <ConditionalRender
                condition={
                    isOwner &&
                    MeetingAccessStatusEnum.EnterName === localUser.accessStatus
                }
            >
                {LoadingWaitingRoom}
            </ConditionalRender>
            {Boolean(meetingTemplate?.id) && (
                <ConditionalRender
                    condition={
                        isOwner ? !isJoinMeetingPending : isSettingsChecked
                    }
                >
                    <ConditionalRender
                        condition={
                            MeetingAccessStatusEnum.InMeeting !==
                            localUser.accessStatus
                        }
                    >
                        <CustomBox
                            className={clsx(styles.waitingRoomWrapper, {
                                [styles.mobile]: isMobile,
                            })}
                        >
                            <ConditionalRender condition={!isOwner}>
                                <>
                                    <MeetingPreview />
                                    <NotMeetingComponent />
                                </>
                            </ConditionalRender>
                        </CustomBox>
                    </ConditionalRender>
                    <ConditionalRender
                        condition={
                            localUser.accessStatus ===
                            MeetingAccessStatusEnum.InMeeting
                        }
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
