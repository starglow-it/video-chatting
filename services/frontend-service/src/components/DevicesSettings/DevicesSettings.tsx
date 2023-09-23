import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'effector-react';
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
    $isAuraActive,
    $isBackgroundAudioActive,
    $isCameraActiveStore,
    $isMicActiveStore,
    $isOwner,
    $isStreamRequestedStore,
    $isUserSendEnterRequest,
    $localUserStore,
    $meetingTemplateStore,
    $videoDevicesStore,
    $videoErrorStore,
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
} from '../../store/roomStores';

// types
import { NotificationType } from '../../store/types';

// styles
import styles from './DevicesSettings.module.scss';

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

    const isOwner = useStore($isOwner);
    const isUserSentEnterRequest = useStore($isUserSendEnterRequest);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);
    const isAuraActive = useStore($isAuraActive);
    const {
        avatar: { list },
    } = useStore($avatarsMeetingStore);
    const { isAuthenticated } = useStore($authStore);

    const isCameraActiveRef = useRef(isCameraActive);

    const isEnterMeetingRequestPending = useStore(
        sendEnterMeetingRequestSocketEvent.pending,
    );
    const isEnterWaitingRoomRequestPending = useStore(
        sendEnterWaitingRoomSocketEvent.pending,
    );

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
        addNotificationEvent({
            type: NotificationType.MicAction,
            message: `meeting.mic.${isMicActive ? 'off' : 'on'}`,
        });

        updateLocalUserEvent({
            micStatus: isMicActive ? 'inactive' : 'active',
        });
        setIsAudioActiveEvent(!isMicActive);
    }, [isMicActive]);

    const handleToggleCamera = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.CamAction,
            message: `meeting.cam.${isCameraActive ? 'off' : 'on'}`,
        });
        updateLocalUserEvent({
            cameraStatus: isCameraActive ? 'inactive' : 'active',
        });
        setIsCameraActiveEvent(!isCameraActive);
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
    }, [isUserSentEnterRequest]);

    const handlePaywallPayment = useCallback(() => {
        setWaitingPaywall(true);
    }, []);

    const handlePaymentSuccess = () => {
        setWaitingPaywall(false);
        handleJoinMeeting();
    };

    const isAudioError = Boolean(audioError);
    const isVideoError = Boolean(videoError);

    const isEnterMeetingDisabled =
        isAudioError ||
        isEnterMeetingRequestPending ||
        isEnterWaitingRoomRequestPending ||
        localUser.accessStatus === MeetingAccessStatusEnum.Waiting;

    const isPayWallBeforeJoin =
        Boolean(meetingTemplate?.paywallPrice) && !isOwner && waitingPaywall;
    const functionPaywall =
        Boolean(meetingTemplate?.paywallPrice) && !isOwner
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
                            videoError={videoError}
                            audioError={audioError}
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
                            {isUserSentEnterRequest ||
                            (!isUserSentEnterRequest &&
                                localUser.accessStatus ===
                                    MeetingAccessStatusEnum.Waiting) ? (
                                <>
                                    <CustomGrid container direction="column">
                                        <CustomTypography
                                            className={styles.title}
                                            variant="h3bold"
                                            nameSpace="meeting"
                                            translation={
                                                localUser.accessStatus ===
                                                MeetingAccessStatusEnum.Waiting
                                                    ? 'meetingNotStarted.title'
                                                    : 'requestSent'
                                            }
                                        />
                                        <CustomTypography
                                            variant="body1"
                                            color="text.secondary"
                                            nameSpace="meeting"
                                            translation={
                                                localUser.accessStatus ===
                                                MeetingAccessStatusEnum.Waiting
                                                    ? 'meetingNotStarted.text'
                                                    : 'enterPermission'
                                            }
                                        />
                                    </CustomGrid>
                                    <ConditionalRender
                                        condition={isUserSentEnterRequest}
                                    >
                                        <CustomGrid
                                            container
                                            alignItems="center"
                                            direction={
                                                isMobile
                                                    ? 'row'
                                                    : 'column-reverse'
                                            }
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
                                        condition={
                                            localUser.accessStatus ===
                                            MeetingAccessStatusEnum.Waiting
                                        }
                                    >
                                        <CustomGrid
                                            className={styles.titleLeaveMessage}
                                        >
                                            <span>Leave a Message</span>
                                        </CustomGrid>
                                        <CustomGrid
                                            className={styles.actions}
                                            gap={2}
                                        >
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
                                                    width={52}
                                                    height={52}
                                                    objectFit="cover"
                                                />
                                                <span>Gmail</span>
                                            </CustomGrid>
                                        </CustomGrid>
                                    </ConditionalRender>
                                </>
                            ) : (
                                <MeetingSettingsContent
                                    stream={changeStream}
                                    isBackgroundActive={
                                        isSettingsAudioBackgroundActive
                                    }
                                    backgroundVolume={
                                        settingsBackgroundAudioVolume
                                    }
                                    isAuraActive={isAuraActive}
                                    onBackgroundToggle={
                                        handleToggleBackgroundAudio
                                    }
                                    onChangeBackgroundVolume={
                                        setSettingsBackgroundAudioVolume
                                    }
                                    onToggleAura={toggleIsAuraActive}
                                    isAudioActive={
                                        meetingTemplate.isAudioAvailable
                                    }
                                    title={
                                        <CustomTypography
                                            className={styles.title}
                                            variant="h3bold"
                                            nameSpace="meeting"
                                            translation={
                                                isMobile
                                                    ? 'settings.main'
                                                    : 'readyToJoin'
                                            }
                                        />
                                    }
                                    isCamera={isCameraActive}
                                    isMicrophone={isMicActive}
                                    onToggleCamera={handleToggleCamera}
                                    onToggleMicrophone={handleToggleMic}
                                />
                            )}
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
                <ConditionalRender condition={!isMobile}>
                    <CustomGrid className={styles.blockAccess}>
                        <CustomImage
                            src="/images/reset-permission.gif"
                            width={10}
                            height={100}
                            unoptimized={false}
                            objectFit="contain"
                        />
                        <CustomTypography
                            textAlign="center"
                            color="colors.grayscale.normal"
                            fontSize={14}
                            nameSpace="meeting"
                            translation="allowAccess.desktop"
                            className={styles.devicesError}
                        />
                    </CustomGrid>
                </ConditionalRender>
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
                        color="colors.grayscale.normal"
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
