import { memo, useEffect, useMemo, useRef } from 'react';
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
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { MeetingBackgroundVideo } from '@components/Meeting/MeetingBackgroundVideo/MeetingBackgroundVideo';
import { Typography } from '@mui/material';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { getAvatarsMeetingEvent } from 'src/store/roomStores/meeting/meetingAvatar/init';
import { NotFoundRoute } from 'src/const/client-routes';
import { useNetworkDetect } from '@hooks/useNetworkDetect';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import {
    $windowSizeStore,
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
    $isLurker,
    $isMeetingSocketConnected,
    $isMeetingSocketConnecting,
    $isOwner,
    $localUserStore,
    $meetingConnectedStore,
    $meetingTemplateStore,
    getMeetingTemplateFx,
    getPaymentMeetingEvent,
    initDevicesEventFxWithStore,
    initiateMeetingSocketConnectionEvent,
    joinMeetingEvent,
    joinMeetingFx,
    joinRoomBeforeMeetingSocketEvent,
    sendJoinWaitingRoomSocketEvent,
    sendLeaveMeetingSocketEvent,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    setCurrentAudioDeviceEvent,
    setCurrentVideoDeviceEvent,
    setIsAudioActiveEvent,
    setIsAuraActive,
    setIsCameraActiveEvent,
    setRoleQueryUrlEvent,
    updateLocalUserEvent,
    updateMeetingEvent,
    updateMeetingSocketEvent,
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
    const { isMobile } = useBrowserDetect();

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
        <CustomPaper
            className={clsx(styles.wrapper, {
                [styles.fitContent]:
                    isMobile &&
                    localUser.accessStatus ===
                        MeetingAccessStatusEnum.EnterName,
            })}
            id="anchor-unlock"
        >
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
    const isLurker = useStore($isLurker);
    const isMeetingSocketConnected = useStore($isMeetingSocketConnected);
    const isMeetingSocketConnecting = useStore($isMeetingSocketConnecting);
    const isJoinMeetingPending = useStore(joinMeetingFx.pending);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);
    const { width, height } = useStore($windowSizeStore);
    const isLoadingFetchMeeting = useStore(getMeetingTemplateFx.pending);
    const isLoadingJoinWaitingRoom = useStore(
        sendJoinWaitingRoomSocketEvent.pending,
    );
    const isMeetingConnected = useStore($meetingConnectedStore);

    const { isMobile } = useBrowserDetect();

    const roleUrl = router.query.role as string;
    const queryToken = router.query.token as string;
    const isMuteYb = router.query.videoMute as string;

    const isFirstime = useRef(true);

    const { value: isSettingsChecked, onSwitchOn: handleSetSettingsChecked } =
        useToggle(false);

    useEffect(() => {
        if (roleUrl) {
            setRoleQueryUrlEvent(roleUrl);
        }
        if (!!roleUrl && roleUrl !== MeetingRole.Lurker) {
            router.push(NotFoundRoute);
        }
    }, [roleUrl]);

    useEffect(() => {
        initWindowListeners();
        initLandscapeListener();

        return () => {
            removeWindowListeners();
            removeLandscapeListener();
        };
    }, []);

    const { status } = useNetworkDetect({
        callbackOff: () => {
            console.log('#Duy Phan console', 'off');
        },
    });

    useSubscriptionNotification(getClientMeetingUrl(queryToken));

    useEffect(() => {
        (async () => {
            BackgroundManager.init();

            getSubscriptionWithDataFx({ subscriptionId: '' });

            await getMeetingTemplateFx({
                templateId: queryToken,
                subdomain: isSubdomain() ? window.location.origin : undefined,
            });

            updateLocalUserEvent({
                accessStatus: MeetingAccessStatusEnum.EnterName,
            });
        })();

        return () => {
            (async () => {
                await sendLeaveMeetingSocketEvent();
                resetRoomStores();
                BackgroundManager.destroy();
            })();
        };
    }, []);

    useEffect(() => {
        getAvatarsMeetingEvent();
        getPaymentMeetingEvent(queryToken);
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
                if (!isLurker) {
                    await initDevicesEventFxWithStore();
                }
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

    useEffect(() => {
        if (
            meetingTemplate?.id &&
            !isMeetingSocketConnecting &&
            !isLoadingJoinWaitingRoom &&
            isMeetingConnected &&
            isFirstime.current &&
            isOwner
        ) {
            const data: any = {
                volume: !!isMuteYb ? 0 : 20,
                isMute: !!isMuteYb,
            };
            updateMeetingEvent(data);
            updateMeetingSocketEvent(data);
            isFirstime.current = false;
        }
    }, [
        meetingTemplate?.id,
        isMuteYb,
        isMeetingSocketConnecting,
        isLoadingJoinWaitingRoom,
        isMeetingConnected,
        isOwner,
    ]);

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

    const previewImage = (meetingTemplate?.previewUrls || []).find(
        image => image.resolution === 1080,
    );

    return (
        <>
            <ConditionalRender
                condition={!meetingTemplate?.id && !isLoadingFetchMeeting}
            >
                <MeetingBackgroundVideo
                    templateType="image"
                    videoClassName={styles.wrapperBackgroundMedia}
                    mediaLink={null}
                    src="/images/room-has-been-deleted.jpg"
                >
                    <CustomImage
                        src="/images/room-has-been-deleted.jpg"
                        className={styles.wrapperBackgroundMedia}
                        width={isMobile ? `${width}px` : '100%'}
                        height={isMobile ? `${height}px` : '100%'}
                        layout="fill"
                        objectFit="cover"
                    />
                </MeetingBackgroundVideo>
            </ConditionalRender>
            <ConditionalRender condition={status === 'off'}>
                <CustomGrid className={styles.networkStatus}>
                    <CustomTypography
                        nameSpace="common"
                        translation="network.off"
                        textAlign="center"
                        color="white"
                        fontSize={13}
                    />
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender
                condition={
                    (!!meetingTemplate.url || !!meetingTemplate.mediaLink) &&
                    isSettingsChecked
                }
            >
                <MeetingBackgroundVideo
                    templateType={meetingTemplate.templateType}
                    src={
                        meetingTemplate.mediaLink?.src ??
                        meetingTemplate.url ??
                        ''
                    }
                    videoClassName={styles.wrapperBackgroundMedia}
                    mediaLink={null}
                >
                    <ConditionalRender
                        condition={
                            !!previewImage?.url || !!meetingTemplate.mediaLink
                        }
                    >
                        <CustomImage
                            src={
                                meetingTemplate.mediaLink?.thumb ??
                                previewImage?.url ??
                                ''
                            }
                            className={styles.wrapperBackgroundMedia}
                            width={isMobile ? `${width}px` : '100%'}
                            height={isMobile ? `${height}px` : '100%'}
                            layout="fill"
                            objectFit="cover"
                        />
                    </ConditionalRender>
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
            {!meetingTemplate?.id && !isLoadingFetchMeeting && (
                <CustomBox
                    className={clsx(styles.waitingRoomWrapper, {
                        [styles.mobile]: isMobile,
                    })}
                >
                    <CustomBox
                        width="100%"
                        textAlign="center"
                        height="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CustomTypography
                            variant="h2bold"
                            nameSpace="meeting"
                            textAlign="center"
                            translation="roomHasBeenDeleted"
                        />
                    </CustomBox>
                </CustomBox>
            )}
            <HostTimeExpiredDialog />
            <MeetingErrorDialog />
        </>
    );
});

export default MeetingContainer;
