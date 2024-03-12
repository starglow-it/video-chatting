import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { CustomCheckbox } from 'shared-frontend/library/custom/CustomCheckbox';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';
import { MeetingSettingsContent } from '@components/Meeting/MeetingSettingsContent/MeetingSettingsContent';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { Translation } from '@library/common/Translation/Translation';

// stores
import { MeetingAccessStatusEnum } from 'shared-types';
import { MeetingPaywall } from '@components/Meeting/MeetingPaywall/MeetingPaywall';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { $avatarsMeetingStore } from 'src/store/roomStores/meeting/meetingAvatar/model';
import { $authStore, $profileStore, addNotificationEvent } from '../../store';
import {
    $activeStreamStore,
    $audioDevicesStore,
    $audioErrorStore,
    $backgroundAudioVolume,
    $changeStreamStore,
    $enabledPaymentPaywallParticipant,
    $isAuraActive,
    $isBackgroundAudioActive,
    $isCameraActiveStore,
    $isMicActiveStore,
    $isOwner,
    $isOwnerInMeeting,
    $isOwnerDoNotDisturb,
    $isStreamRequestedStore,
    $localUserStore,
    $meetingTemplateStore,
    $meetingUsersStore,
    $videoDevicesStore,
    $videoErrorStore,
    $isPaywallPaid,
    setIsPaywallPaymentEnabled,
    joinMeetingEvent,
    sendCancelAccessMeetingRequestEvent,
    sendEnterMeetingRequestSocketEvent,
    sendEnterWaitingRoomSocketEvent,
    setActiveStreamEvent,
    setIsAudioActiveEvent,
    setIsCameraActiveEvent,
    toggleIsAuraActive,
    updateLocalUserEvent,
    updateUserSocketEvent,
    rejoinMeetingEvent,
} from '../../store/roomStores';

// types
import { NotificationType } from '../../store/types';

// styles
import styles from './DevicesSettings.module.scss';
import { MEDIA_NOT_ALLOWED_BY_BROWSER, MEDIA_NOT_ALLOWED_BY_SYSTEM, MEDIA_OPERATION_ABORTED, MEDIA_DEVICE_NOT_FOUND, MEDIA_DEVICE_NOT_ACCESSIBLE, MEDIA_CONSTRAINTS_CANNOT_BE_SATISFIED, MEDIA_SECURITY_ERROR, MEDIA_INVALID_CONSTRAINTS, MEDIA_GENERAL_ERROR } from 'src/helpers/media/getMediaStream';

const Component = () => {
    const [waitingPaywall, setWaitingPaywall] = useState(false);
    const profile = useStore($profileStore);
    const localUser = useStore($localUserStore);

    const isStreamRequested = useStore($isStreamRequestedStore);
    const changeStream = useStore($changeStreamStore);
    const activeStream = useStore($activeStreamStore);
    const isMicActive = useStore($isMicActiveStore);
    const isCameraActive = useStore($isCameraActiveStore);
    const videoDevices = useStore($videoDevicesStore);
    const audioDevices = useStore($audioDevicesStore);
    const videoError = useStore($videoErrorStore);
    const audioError = useStore($audioErrorStore);
    const isPaywallPaid = useStore($isPaywallPaid);
    const [showDeviceError, setShowDeviceError] = useState("");

    const isOwner = useStore($isOwner);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);
    const isAuraActive = useStore($isAuraActive);
    const {
        avatar: { list },
    } = useStore($avatarsMeetingStore);
    const { isAuthenticated } = useStore($authStore);
    const enabledPaymentPaywallParticipant = useStore(
        $enabledPaymentPaywallParticipant,
    );

    const isCameraActiveRef = useRef(isCameraActive);

    const isEnterMeetingRequestPending = useStore(
        sendEnterMeetingRequestSocketEvent.pending,
    );
    const isEnterWaitingRoomRequestPending = useStore(
        sendEnterWaitingRoomSocketEvent.pending,
    );
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
    const isUserSentEnterRequest =
        localUser.accessStatus === MeetingAccessStatusEnum.RequestSent;

    const [settingsBackgroundAudioVolume, setSettingsBackgroundAudioVolume] =
        useState<number>(backgroundAudioVolume);

    const {
        value: needToRememberSettings,
        onToggleSwitch: handleToggleRememberSettings,
    } = useToggle(false);

    const {
        value: isSettingsAudioBackgroundActive,
        onToggleSwitch: handleToggleBackgroundAudio,
    } = useToggle(isBackgroundAudioActive);

    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        updateLocalUserEvent({
            isAuraActive,
        });
    }, [isAuraActive]);

    useEffect(() => {
        setActiveStreamEvent(changeStream?.clone());
    }, [changeStream]);

    useEffect(() => {
        isCameraActiveRef.current = isCameraActive;
    }, [isCameraActive]);

    const handleToggleMic = useCallback(() => {
        if (isAudioError) {
            addNotificationEvent({
                type: NotificationType.MicAction,
                message: `meeting.deviceErrors.${audioError?.type}`,
            });
            setShowDeviceError('audio');
        } else {
            addNotificationEvent({
                type: NotificationType.MicAction,
                message: `meeting.mic.${isMicActive ? 'off' : 'on'}`,
            });

            updateLocalUserEvent({
                micStatus: isMicActive ? 'inactive' : 'active',
            });
            setIsAudioActiveEvent(!isMicActive);
        }
    }, [isMicActive]);

    useEffect(() => {
        if (
            localUser.accessStatus === MeetingAccessStatusEnum.RequestSentWhenDnd &&
            isHasMeeting &&
            isOwnerInMeeting &&
            !isOwnerDoNotDisturb
        ) {
            handleJoinMeeting();
        }
    }, [isHasMeeting, isOwnerInMeeting, isOwnerDoNotDisturb, localUser.accessStatus]);

    const handleToggleCamera = useCallback(() => {
        if (isVideoError) {
            addNotificationEvent({
                type: NotificationType.MicAction,
                message: `meeting.deviceErrors.${videoError?.type}`,
            });
            setShowDeviceError('video');
        } else {
            addNotificationEvent({
                type: NotificationType.CamAction,
                message: `meeting.cam.${isCameraActive ? 'off' : 'on'}`,
            });
            updateLocalUserEvent({
                cameraStatus: isCameraActive ? 'inactive' : 'active',
            });
            setIsCameraActiveEvent(!isCameraActive);
        }
    }, [isCameraActive]);

    const handleJoinMeeting = useCallback(async () => {
        joinMeetingEvent({
            isSettingsAudioBackgroundActive,
            settingsBackgroundAudioVolume,
            needToRememberSettings,
        });
    }, [
        isSettingsAudioBackgroundActive,
        settingsBackgroundAudioVolume,
        needToRememberSettings,
    ]);

    const handleCancelRequest = useCallback(async () => {
        await sendCancelAccessMeetingRequestEvent();
    }, []);

    const onSubmit = useCallback(handleJoinMeeting, [handleJoinMeeting]);

    const handleBack = useCallback(async () => {
        if (isUserSentEnterRequest) {
            await sendCancelAccessMeetingRequestEvent();
        }

        updateLocalUserEvent({
            accessStatus: MeetingAccessStatusEnum.EnterName,
        });
        updateUserSocketEvent({
            accessStatus: MeetingAccessStatusEnum.EnterName,
        });

        // const meetingUserId = localStorage.getItem('meetingUserId');

        // await rejoinMeetingEvent(meetingUserId || '');
    }, [isUserSentEnterRequest]);

    const handlePaywallPayment = useCallback(() => {
        if (isHasMeeting && isOwnerInMeeting && isOwnerDoNotDisturb) {
            updateLocalUserEvent({
                accessStatus: MeetingAccessStatusEnum.Waiting
            });

            handleJoinMeeting();
        } else {
            setWaitingPaywall(true);
        }
    }, []);

    const handlePaymentSuccess = async () => {
        setWaitingPaywall(false);
        handleJoinMeeting();
        setIsPaywallPaymentEnabled(true);
    };

    const isAudioError = Boolean(audioError);
    const isVideoError = Boolean(videoError);
    useEffect(() => {
        if (isAudioError) {
            setIsAudioActiveEvent(false); // This assumes setIsAudioActiveEvent will set isMicActive to false
        }
    }, [isAudioError]);

    useEffect(() => {
        if (isVideoError) {
            setIsCameraActiveEvent(false); // This assumes setIsCameraActiveEvent will set isCameraActive to false
        }
    }, [isVideoError]);

    const isAccessStatusWaiting =
        localUser.accessStatus === MeetingAccessStatusEnum.Waiting;

    const isEnterMeetingDisabled =
        isEnterMeetingRequestPending ||
        isEnterWaitingRoomRequestPending ||
        isAccessStatusWaiting;

    const isPayWallBeforeJoin =
        enabledPaymentPaywallParticipant && waitingPaywall && !isPaywallPaid;
    const functionPaywall = enabledPaymentPaywallParticipant && !isPaywallPaid
        ? handlePaywallPayment
        : handleJoinMeeting;
    const joinHandler = isOwner ? onSubmit : functionPaywall;

    const linkToDefault = () => {
        window.open(
            `mailto:?view=cm&fs=1&subject=While you were out
            &body=${encodeURI('Missed you on Ruume… Shall we re-schedule?')}`,
            '_blank',
        );
    };

    const linkToGmail = () => {
        window.open(
            `
        https://mail.google.com/mail/?view=cm&fs=1&su=While you were out&body=${encodeURI(
                'Missed you on Ruume… Shall we re-schedule?',
            )}`,
            '_blank',
        );
    };

    const renderMeetingNotStartedYet = () => {
        return (
            <>
                <ConditionalRender condition={!isHasMeeting}>
                    <CustomGrid container direction="column">
                        <CustomTypography
                            className={styles.title}
                            variant="h4bold"
                            nameSpace="meeting"
                            translation="hostWaitingNotify.title"
                        />
                        <CustomTypography
                            variant="body1"
                            color="text.secondary"
                            nameSpace="meeting"
                            translation="hostWaitingNotify.text"
                        />
                    </CustomGrid>
                </ConditionalRender>
                <CustomGrid className={styles.titleLeaveMessage}>
                    <span>Leave a Message</span>
                </CustomGrid>
                <CustomGrid className={styles.actions} gap={2}>
                    <CustomGrid
                        className={styles.actionItem}
                        onClick={linkToDefault}
                    >
                        <CustomImage
                            src="/images/default-gmail.jpg"
                            width={60}
                            height={60}
                            objectFit="cover"
                        />
                        <span>Default Email</span>
                    </CustomGrid>
                    <CustomGrid
                        className={styles.actionItem}
                        onClick={linkToGmail}
                    >
                        <CustomImage
                            src="/images/gmail.png"
                            alt=""
                            width={52}
                            height={52}
                            objectFit="cover"
                        />
                        <span>Gmail</span>
                    </CustomGrid>
                </CustomGrid>
            </>
        );
    };

    const renderMeetingDoNotDisturb = () => {
        return (
            <>
                <CustomGrid container direction="column">
                    <CustomTypography
                        className={styles.title}
                        variant="h4bold"
                        nameSpace="meeting"
                        translation="hostWaitingNotify.title"
                    />
                    <CustomTypography
                        variant="body1"
                        color="text.secondary"
                        nameSpace="meeting"
                        translation="hostWaitingNotify.text"
                    />
                </CustomGrid>

                <CustomGrid className={styles.titleLeaveMessage}>
                    <span>Leave a Message</span>
                </CustomGrid>
                <CustomGrid className={styles.actions} gap={2}>
                    <CustomGrid
                        className={styles.actionItem}
                        onClick={linkToDefault}
                    >
                        <CustomImage
                            src="/images/default-gmail.jpg"
                            width={60}
                            height={60}
                            objectFit="cover"
                        />
                        <span>Default Email</span>
                    </CustomGrid>
                    <CustomGrid
                        className={styles.actionItem}
                        onClick={linkToGmail}
                    >
                        <CustomImage
                            src="/images/gmail.png"
                            alt=""
                            width={52}
                            height={52}
                            objectFit="cover"
                        />
                        <span>Gmail</span>
                    </CustomGrid>
                </CustomGrid>
            </>
        );
    };

    const renderMainContent = () => {
        switch (localUser.accessStatus) {
            case MeetingAccessStatusEnum.Settings:
            case MeetingAccessStatusEnum.Rejected:
            case MeetingAccessStatusEnum.Left:
            case MeetingAccessStatusEnum.Kicked:
                return (
                    <MeetingSettingsContent
                        stream={changeStream}
                        isBackgroundActive={isSettingsAudioBackgroundActive}
                        backgroundVolume={settingsBackgroundAudioVolume}
                        isAuraActive={isAuraActive}
                        onBackgroundToggle={handleToggleBackgroundAudio}
                        onChangeBackgroundVolume={
                            setSettingsBackgroundAudioVolume
                        }
                        onToggleAura={toggleIsAuraActive}
                        isAudioActive={meetingTemplate.isAudioAvailable}
                        title={
                            <CustomTypography
                                className={styles.title}
                                variant="h4bold"
                                nameSpace="meeting"
                                translation={
                                    isMobile ? 'settings.main' : 'readyToJoin'
                                }
                            />
                        }
                        isCamera={isCameraActive}
                        isMicrophone={isMicActive}
                        onToggleCamera={handleToggleCamera}
                        onToggleMicrophone={handleToggleMic}
                    />
                );
            case MeetingAccessStatusEnum.RequestSent:
                return (
                    <>
                        <ConditionalRender
                            condition={isHasMeeting && isOwnerInMeeting}
                        >
                            <CustomGrid container direction="column">
                                <CustomTypography
                                    className={styles.title}
                                    variant="h4bold"
                                    nameSpace="meeting"
                                    translation="requestSent"
                                />
                                <CustomTypography
                                    variant="body1"
                                    color="text.secondary"
                                    nameSpace="meeting"
                                    translation="enterPermission"
                                />
                            </CustomGrid>
                            <CustomGrid
                                container
                                alignItems="center"
                                direction={isMobile ? 'row' : 'column-reverse'}
                                className={clsx(styles.loader, {
                                    [styles.mobile]: isMobile,
                                })}
                                gap={1}
                            >
                                <CustomLoader />
                                <CustomTypography
                                    color="colors.orange.primary"
                                    nameSpace="meeting"
                                    translation="waitForHost"
                                />
                            </CustomGrid>
                        </ConditionalRender>
                        <ConditionalRender
                            condition={isHasMeeting && !isOwnerInMeeting}
                        >
                            <CustomGrid container direction="column">
                                <CustomTypography
                                    className={styles.title}
                                    variant="h4bold"
                                    nameSpace="meeting"
                                    translation="hostLeftRoom.title"
                                />
                                <CustomTypography
                                    variant="body1"
                                    color="text.secondary"
                                    nameSpace="meeting"
                                    translation="hostLeftRoom.text"
                                />
                            </CustomGrid>
                        </ConditionalRender>
                        <ConditionalRender
                            condition={
                                !isHasMeeting ||
                                (isHasMeeting && !isOwnerInMeeting)
                            }
                        >
                            {renderMeetingNotStartedYet()}
                        </ConditionalRender>

                    </>
                );

            case MeetingAccessStatusEnum.RequestSentWhenDnd:
            case MeetingAccessStatusEnum.Waiting:
                return (
                    <>
                        <ConditionalRender
                            condition={isHasMeeting && !isOwnerInMeeting}
                        >
                            <CustomGrid container direction="column">
                                <CustomTypography
                                    className={styles.title}
                                    variant="h4bold"
                                    nameSpace="meeting"
                                    translation="hostLeftRoom.title"
                                />
                                <CustomTypography
                                    variant="body1"
                                    color="text.secondary"
                                    nameSpace="meeting"
                                    translation="hostLeftRoom.text"
                                />
                            </CustomGrid>
                        </ConditionalRender>
                        <ConditionalRender
                            condition={!isOwnerDoNotDisturb}
                        >
                            {renderMeetingNotStartedYet()}
                        </ConditionalRender>
                        <ConditionalRender
                            condition={isHasMeeting && isOwnerInMeeting && isOwnerDoNotDisturb}
                        >
                            {renderMeetingDoNotDisturb()}
                        </ConditionalRender>
                    </>
                );

            default:
                return null;
        }
    };

    const renderErrorContent = (src: string, translationKey: string) => (
        <>
            <ConditionalRender condition={Boolean(src)}>
                <CustomImage
                    src={src}
                    width={10}
                    height={100}
                    unoptimized={false}
                    objectFit="contain"
                />
            </ConditionalRender>
            <CustomTypography
                textAlign="center"
                fontSize={14}
                nameSpace="meeting"
                translation={translationKey}
                className={styles.devicesError}
            />
        </>
    );

    const openSystemSettings = (): void => {
        const userAgent: string = navigator.userAgent;
        const deviceSetting = showDeviceError === "video" ? 'camera' : 'microphone';

        let preferencesURI: string;

        if (/Mac|Macintosh|OS X/.test(userAgent)) {
            const macSetting = deviceSetting === 'camera' ? 'Privacy_Camera' : 'Privacy_Microphone';
            preferencesURI = `x-apple.systempreferences:com.apple.preference.security?${macSetting}`;
        } else if (/Windows/.test(userAgent)) {
            const windowsSetting = deviceSetting === 'camera' ? 'webcam' : 'microphone';
            preferencesURI = `ms-settings:privacy-${windowsSetting}`;
        } else {
            // Default to Linux or other OS
            preferencesURI = `gnome-control-center ${deviceSetting}`;
        }

        openPreferences(preferencesURI);
    };
    const openPreferences = (preferencesURI: string): void => {
        try {
            window.open(preferencesURI);
        } catch (error) {
            console.error("Failed to open preferences:", error);
        }
    };

    const determineRenderContent = () => {
        if (showDeviceError == "") {
            return (
                <CustomTypography
                    textAlign="center"
                    fontSize={14}
                    nameSpace="meeting"
                    translation="allowAccess.desktop.noDevice"
                    className={styles.devicesError}
                />
            );
        }
        const error = showDeviceError == "audio" ? audioError : videoError;
        if (error?.type == MEDIA_NOT_ALLOWED_BY_BROWSER) {
            // return renderErrorContent("/images/reset-permission.gif", "allowAccess.desktop.allowDevice");
            return renderErrorContent("", "allowAccess.desktop.allowDevice");
        }

        if (error?.type == MEDIA_NOT_ALLOWED_BY_SYSTEM) {
            return (
                <>
                    <CustomTypography
                        textAlign="center"
                        fontSize={14}
                        nameSpace="meeting"
                        translation="allowAccess.desktop.allowChromeDescription"
                        className={styles.devicesError}
                    />
                    {renderErrorContent("", "allowAccess.desktop.allowChrome")}
                    <CustomGrid
                        container
                        gap={1}
                        wrap="nowrap" className={styles.openSystemSettingsButton}>
                        <CustomButton
                            onClick={openSystemSettings}
                            variant="custom-primary"
                            label={
                                <Translation
                                    nameSpace="common"
                                    translation="buttons.openSystemSettings"
                                />
                            }
                        />
                    </CustomGrid>
                </>
            );
        }

        if (error?.type == MEDIA_DEVICE_NOT_FOUND) {
            return renderErrorContent("", "allowAccess.desktop.notFoundDevice");
        }

        if (error?.type == MEDIA_GENERAL_ERROR) {
            return renderErrorContent("", "allowAccess.desktop.errorDevice");
        }
        if (error?.type == MEDIA_OPERATION_ABORTED ||
            error?.type == MEDIA_DEVICE_NOT_ACCESSIBLE ||
            error?.type == MEDIA_CONSTRAINTS_CANNOT_BE_SATISFIED ||
            error?.type == MEDIA_SECURITY_ERROR ||
            error?.type == MEDIA_INVALID_CONSTRAINTS) {
            return renderErrorContent("", error?.message || "");
        }
    };

    return (
        <>
            <CustomGrid container direction="column" wrap="nowrap">
                <CustomGrid
                    container
                    direction={isMobile ? 'column' : 'row'}
                    wrap="nowrap"
                    className={clsx(styles.settingsContent, {
                        [styles.mobile]: isMobile,
                    })}
                >
                    <ConditionalRender condition={!isPayWallBeforeJoin}>
                        <MediaPreview
                            videoError={videoError || undefined}
                            audioError={audioError || undefined}
                            isMicActive={isMicActive}
                            isCameraActive={isCameraActive}
                            videoDevices={videoDevices}
                            audioDevices={audioDevices}
                            profileAvatar={
                                localUser.meetingAvatarId
                                    ? list.find(
                                        item =>
                                            item.id ===
                                            localUser.meetingAvatarId,
                                    )?.resouce.url
                                    : profile.profileAvatar?.url
                            }
                            userName={localUser?.username}
                            stream={activeStream}
                            onToggleAudio={handleToggleMic}
                            onToggleVideo={handleToggleCamera}
                            isUnlockAccess={!isAuthenticated}
                        />
                        <CustomDivider orientation="vertical" flexItem />
                    </ConditionalRender>
                    <ConditionalRender condition={isPayWallBeforeJoin}>
                        <MeetingPaywall
                            onPaymentSuccess={handlePaymentSuccess}
                        />
                    </ConditionalRender>
                    <ConditionalRender condition={!isPayWallBeforeJoin}>
                        <CustomGrid
                            className={styles.devicesWrapper}
                            container
                            direction={
                                isMobile && isUserSentEnterRequest
                                    ? 'column-reverse'
                                    : 'column'
                            }
                            wrap="nowrap"
                        >
                            <CustomGrid className={styles.blockAccess}>
                                {renderMainContent()}
                            </CustomGrid>

                            <ConditionalRender condition={isOwner}>
                                <CustomCheckbox
                                    labelClassName={styles.label}
                                    checked={needToRememberSettings}
                                    label={
                                        <Translation
                                            nameSpace="meeting"
                                            translation="settings.remember"
                                        />
                                    }
                                    onChange={handleToggleRememberSettings}
                                />
                            </ConditionalRender>
                        </CustomGrid>
                    </ConditionalRender>
                </CustomGrid>
            </CustomGrid>
            <ConditionalRender condition={isAudioError || isVideoError}>
                {determineRenderContent()}
                <ConditionalRender condition={isMobile}>
                    <CustomImage
                        src="/images/reload.svg"
                        width={10}
                        height={85}
                        objectFit="contain"
                        onClick={() => window.location.reload()}
                    />
                    <CustomTypography
                        textAlign="center"
                        fontSize={14}
                        nameSpace="meeting"
                        translation="allowAccess.mobile"
                        className={styles.devicesError}
                    />

                </ConditionalRender>
            </ConditionalRender>
            <CustomGrid
                container
                gap={1}
                wrap="nowrap"
                className={clsx(styles.joinBtn, {
                    [styles.mobile]: isMobile,
                    [styles.accessError]: isAudioError || isVideoError,
                })}
            >
                <ConditionalRender
                    condition={!isUserSentEnterRequest && !isPayWallBeforeJoin}
                >
                    <CustomButton
                        onClick={handleBack}
                        variant="custom-cancel"
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.back"
                            />
                        }
                    />
                </ConditionalRender>
                <ConditionalRender condition={!isPayWallBeforeJoin}>
                    <CustomButton
                        onClick={
                            isUserSentEnterRequest
                                ? handleCancelRequest
                                : joinHandler
                        }
                        disabled={isEnterMeetingDisabled || isStreamRequested}
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation={
                                    isUserSentEnterRequest
                                        ? 'buttons.cancel'
                                        : 'buttons.join'
                                }
                            />
                        }
                        variant={
                            isUserSentEnterRequest
                                ? 'custom-cancel'
                                : 'custom-primary'
                        }
                    />
                </ConditionalRender>
            </CustomGrid>
        </>
    );
};

export const DevicesSettings = memo(Component);
