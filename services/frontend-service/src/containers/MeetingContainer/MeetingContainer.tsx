import { memo, useState, useEffect, useMemo, useRef } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import Head from 'next/head';

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
import { MeetingPreEvent } from '@components/Meeting/MeetingPreEvent/MeetingPreEvent';
import { DevicesSettings } from '@components/DevicesSettings/DevicesSettings';
import { HostTimeExpiredDialog } from '@components/Dialogs/HostTimeExpiredDialog/HostTimeExpiredDialog';
import { MeetingView } from '@components/Meeting/MeetingView/MeetingView';
import { DownloadIcsEventDialog } from '@components/Dialogs/DownloadIcsEventDialog/DownloadIcsEventDialog';

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
import { getPreviewImage } from 'src/utils/functions/getPreviewImage';
import {
    $windowSizeStore,
    getSubscriptionWithDataFx,
    initLandscapeListener,
    initWindowListeners,
    removeLandscapeListener,
    removeWindowListeners,
    resetRoomStores,
    resetMeetingRecordingStore
} from '../../store';
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    $isAudience,
    $isMeetingSocketConnected,
    $isMeetingSocketConnecting,
    $isOwner,
    $localUserStore,
    $meetingConnectedStore,
    $meetingTemplateStore,
    $isPaywallPaymentEnabled,
    $meetingUsersStore,
    $isOwnerInMeeting,
    $isOwnerDoNotDisturb,
    $meetingStore,
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
    isRoomPaywalledFx,
    setIsPaywallPaymentEnabled,
    updateUserSocketEvent,
    sentRequestToHostWhenDnd
} from '../../store/roomStores';
import getLocationInfo from '../../helpers/getLocationInfo';
import { addOrangeNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';

// types
import { SavedSettings } from '../../types';
import { PaymentType } from 'shared-const';

// styles
import styles from './MeetingContainer.module.scss';

// utils
import {
    StorageKeysEnum,
    WebStorage,
} from '../../controllers/WebStorageController';
import { getClientMeetingUrl } from '../../utils/urls';
import { BackgroundManager } from '../../helpers/media/applyBlur';

const NotMeetingComponent = memo(({ isShow = false, isRecorder }: { isShow: boolean, isRecorder: boolean }) => {
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
        <ConditionalRender condition={isShow}>
            <CustomPaper
                className={clsx(styles.wrapper, {
                    [styles.fitContent]:
                        isMobile &&
                        localUser.accessStatus ===
                        MeetingAccessStatusEnum.EnterName,
                    [styles.isRecorder]: isRecorder
                })}
                id="anchor-unlock"
            >
                <CustomScroll className={styles.scroll}>
                    <CustomGrid container direction="column" wrap="nowrap">
                        <ChildComponent />
                    </CustomGrid>
                </CustomScroll>
            </CustomPaper>
        </ConditionalRender>
    );
});

const MeetingContainer = memo(() => {
    const router = useRouter();

    const localUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isOwner = useStore($isOwner);
    const isAudience = useStore($isAudience);
    const isMeetingSocketConnected = useStore($isMeetingSocketConnected);
    const isMeetingSocketConnecting = useStore($isMeetingSocketConnecting);
    const isJoinMeetingPending = useStore(joinMeetingFx.pending);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);
    const isPaywallPaymentEnabled = useStore($isPaywallPaymentEnabled);
    const { width, height } = useStore($windowSizeStore);
    const isLoadingFetchMeeting = useStore(getMeetingTemplateFx.pending);
    const isLoadingJoinWaitingRoom = useStore(
        sendJoinWaitingRoomSocketEvent.pending,
    );
    const isMeetingConnected = useStore($meetingConnectedStore);
    const [isMeetingPreviewShow, setIsMeetingPreviewShow] = useState(false);
    const { isMobile } = useBrowserDetect();
    const roleUrl = router.query.role as string;
    const queryToken = router.query.token as string;
    const isMuteYb = router.query.videoMute as string;
    const isRecorder = roleUrl === MeetingRole.Recorder;
    const isFirstime = useRef(true);
    const { value: isSettingsChecked, onSwitchOn: handleSetSettingsChecked } = useToggle(false);
    const isHasMeeting = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.some(
                user => user.accessStatus === MeetingAccessStatusEnum.InMeeting,
            ),
    });
    const isOwnerInMeeting = useStore($isOwnerInMeeting);
    const isOwnerDoNotDisturb = useStore($isOwnerDoNotDisturb);
    const meeting = useStore($meetingStore);

    useEffect(() => {
        if (roleUrl) {
            setRoleQueryUrlEvent(roleUrl);
        }
        if (!!roleUrl && (roleUrl !== MeetingRole.Audience && !isRecorder)) {
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

            await getLocationInfo();
        })();

        return () => {
            (async () => {
                await sendLeaveMeetingSocketEvent();
                resetRoomStores();
                resetMeetingRecordingStore();
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
    }, [
        meetingTemplate?.meetingInstance,
        isMeetingSocketConnecting,
    ]);

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
                if (!isAudience && !isRecorder) {
                    await initDevicesEventFxWithStore();
                }

                let meetingUserIds = localStorage.getItem('meetingUserIds');
                let parsedMeetingUserIds: { id: string, date: string }[] =
                    meetingUserIds &&
                        Array.isArray(JSON.parse(meetingUserIds))
                        ? JSON.parse(meetingUserIds)
                        : [];
                parsedMeetingUserIds = parsedMeetingUserIds
                    .filter((item: { id: string, date: string }) => {
                        const diffInMs: number = new Date().getTime() - new Date(item.date).getTime();
                        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                        return diffInDays <= 7;
                    });
                const userIds = parsedMeetingUserIds.map(item => item.id);
                await sendJoinWaitingRoomSocketEvent({userIds, isScheduled: Boolean(isMuteYb)});

                if (isOwner) {
                    if (isHasSettings) {
                        joinMeetingEvent({
                            isSettingsAudioBackgroundActive:
                                savedSettings.backgroundAudioSetting,
                            settingsBackgroundAudioVolume:
                                savedSettings.backgroundAudioVolumeSetting,
                            needToRememberSettings: false,
                        });
                    } else {
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

    useEffect(() => {
        if (!isMuteYb) {
            setIsMeetingPreviewShow(true);
        }
    }, [isMuteYb]);

    useEffect(() => {
        const fetch = async () => {
            const meetingRole = !!router.query.role ? MeetingRole.Audience : MeetingRole.Participant;

            await isRoomPaywalledFx({
                templateId: meetingTemplate.id,
                meetingRole: meetingRole,
                paymentType: PaymentType.Paywall
            });
        };

        fetch();
    }, [router, meetingTemplate.id]);

    useEffect(() => {
        if (
            localUser.accessStatus === MeetingAccessStatusEnum.InMeeting ||
            localUser.isPaywallPaid
        ) {
            let meetingUserIds = localStorage.getItem('meetingUserIds');
            let parsedMeetingUserIds = meetingUserIds && Array.isArray(JSON.parse(meetingUserIds)) ? [...JSON.parse(meetingUserIds)] : [];

            if (!!localUser.id && parsedMeetingUserIds.findIndex(item => item.id === localUser.id) === -1) {
                parsedMeetingUserIds.push({ id: localUser.id, date: new Date() });
                localStorage.setItem('meetingUserIds', JSON.stringify(parsedMeetingUserIds));
            }
        }
    }, [localUser]);

    useEffect(() => {
        if (isPaywallPaymentEnabled && localUser.accessStatus === MeetingAccessStatusEnum.InMeeting && !Boolean(isMuteYb)) {
            updateUserSocketEvent({ isPaywallPaid: true });
            setIsPaywallPaymentEnabled(false);
        }
    }, [isPaywallPaymentEnabled, localUser]);

    useEffect(() => {
        if (
            localUser.meetingRole === MeetingRole.Audience &&
            !isOwnerInMeeting &&
            localUser.accessStatus === MeetingAccessStatusEnum.InMeeting &&
            localUser.isPaywallPaid
        ) {
            addOrangeNotificationEvent({
                type: NotificationType.HostIsAwayForAudiencePaywallPayment,
                message: 'hostIsAway',
                isIconHand: true
            });
        }
    }, [localUser, isOwnerInMeeting]);

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

    useEffect(() => {
        if (
            localUser.accessStatus === MeetingAccessStatusEnum.Waiting &&
            isHasMeeting &&
            isOwnerInMeeting &&
            isOwnerDoNotDisturb
        ) {
            sentRequestToHostWhenDnd({ meetingId: meeting.id, username: localUser.username });
        }

        if (
            localUser.accessStatus === MeetingAccessStatusEnum.RequestSentWhenDnd &&
            isHasMeeting &&
            isOwnerInMeeting &&
            !isOwnerDoNotDisturb
        ) {

        }
    }, [isHasMeeting, isOwnerInMeeting, isOwnerDoNotDisturb, localUser]);

    const previewImage = getPreviewImage(meetingTemplate);

    const handleSetMeetingPreviewShow = () => setIsMeetingPreviewShow(true);

    return (
        <>
            <Head>
                <title>Ruume {meetingTemplate.name}</title>
            </Head>
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
                    src={previewImage}
                    videoClassName={styles.wrapperBackgroundMedia}
                    mediaLink={null}
                >
                    <ConditionalRender condition={!!previewImage}>
                        <CustomImage
                            src={previewImage}
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
                                    <MeetingPreview isShow={isMeetingPreviewShow} />
                                    <MeetingPreEvent isShow={!isMeetingPreviewShow} handleSetMeetingPreviewShow={handleSetMeetingPreviewShow} />
                                    <NotMeetingComponent isShow={isMeetingPreviewShow} isRecorder={isRecorder} />
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
            <DownloadIcsEventDialog />
        </>
    );
});

export default MeetingContainer;
