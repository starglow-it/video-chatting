import { memo, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';
import { useRouter } from 'next/router';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// common
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';

// icons
import { HangUpIcon } from 'shared-frontend/icons/OtherIcons/HangUpIcon';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { ChatIcon } from 'shared-frontend/icons/OtherIcons/ChatIcon';
import { NotesIcon } from 'shared-frontend/icons/OtherIcons/NotesIcon';
import { SettingsIcon } from 'shared-frontend/icons/OtherIcons/SettingsIcon';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'; //@mui icon
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CircularProgress from '@mui/material/CircularProgress';

// stores
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { Translation } from '@library/common/Translation/Translation';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { deleteUserAnonymousCookies } from 'src/helpers/http/destroyCookies';
import { PersonPlusIcon } from 'shared-frontend/icons/OtherIcons/PersonPlusIcon';
import { ArrowUp } from 'shared-frontend/icons/OtherIcons/ArrowUp';
import { $authStore, addNotificationEvent, appDialogsApi, deleteDraftUsers } from '../../../store';
import {
    $audioErrorStore,
    $isHaveNewMessage,
    $isAudience,
    $isMeetingHostStore,
    $isOwner,
    $isRecordingStore,
    $isToggleUsersPanel,
    $localUserStore,
    $meetingConnectedStore,
    $meetingUsersStore,
    $doNotDisturbStore,
    $meetingNotesVisibilityStore,
    $meetingEmojiListVisibilityStore,
    setMeetingNotesVisibilityEvent,
    setEmojiListVisibilityEvent,
    $meetingStore,
    $meetingRecordingStore,
    $meetingRecordingIdStore,
    setDoNotDisturbEvent,
    disconnectFromVideoChatEvent,
    requestSwitchRoleByAudienceEvent,
    sendLeaveMeetingSocketEvent,
    setDevicesPermission,
    setIsAudioActiveEvent,
    startRecordMeeting,
    stopRecordMeeting,
    toggleSchedulePanelEvent,
    toggleUsersPanelEvent,
    updateLocalUserEvent,
    $isToggleSchedulePanel,
    $isHaveNewQuestion,
    updateUserSocketEvent,
    startScreenSharing,
    stopScreenSharing,
    startRecordStreamFx,
    stopRecordStreamFx,
    $isScreenSharingStore,
} from '../../../store/roomStores';

// styles
import styles from './MeetingControlButtons.module.scss';
import { clientRoutes } from '../../../const/client-routes';
import config from '../../../const/config';
import { MeetingMonetizationButton } from '../MeetingMonetization/MeetingMonetizationButton';
import { AppDialogsEnum, NotificationType } from 'src/store/types';
import { SharingIcon } from 'shared-frontend/icons/OtherIcons/SharingIcon';

const Component = () => {
    const router = useRouter();
    const fullUrl = typeof window !== 'undefined' ? window.location.href : '';

    const isMeetingHost = useStore($isMeetingHostStore);
    const localUser = useStore($localUserStore);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const { isWithoutAuthen } = useStore($authStore);
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isSchedulePannelOpen = useStore($isToggleSchedulePanel);
    const isAudience = useStore($isAudience);
    const isOwner = useStore($isOwner);
    const meeting = useStore($meetingStore);
    const meetingRecordingId = useStore($meetingRecordingIdStore);
    const meetingRecordingStore = useStore($meetingRecordingStore);
    const recordingStartPending = useStore(startRecordStreamFx.pending);
    const recordingStopPending = useStore(stopRecordStreamFx.pending);

    const isThereNewRequests = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.some(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.RequestSent ||
                    user.accessStatus === MeetingAccessStatusEnum.RequestSentWhenDnd ||
                    user.accessStatus ===
                    MeetingAccessStatusEnum.SwitchRoleSent,
            ),
    });
    const isThereNewMessage = useStore($isHaveNewMessage);
    const isThereNewQuestion = useStore($isHaveNewQuestion);

    const audioError = useStore($audioErrorStore);
    const isAudioError = Boolean(audioError);

    const isMicActive = localUser.micStatus === 'active';
    const isCamActive = localUser.cameraStatus === 'active';

    const { isMobile } = useBrowserDetect();
    const { isVisible } = useStore($meetingNotesVisibilityStore);
    const { isEmojiListVisible } = useStore($meetingEmojiListVisibilityStore);
    const isRecording = useStore($isRecordingStore);
    const doNotDisturbStore = useStore($doNotDisturbStore);
    const isSharingActive = useStore($isScreenSharingStore);
    const isSharingScreenActive = localUser.id === meeting.sharingUserId;
    const isAbleToToggleSharing =
        isMeetingHost || isSharingScreenActive || !meeting.sharingUserId;

    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole !== MeetingRole.Audience &&
                    user.meetingRole !== MeetingRole.Recorder,
            ),
    });

    useEffect(() => {
        return () => {
            if (isRecording && users.length === 0 && meetingRecordingId) {
                stopRecordMeeting({ id: meetingRecordingId, url: fullUrl, byRequest: true, meetingId: meeting.id });
            }
        }
    }, [users]);

    useEffect(() => {
        if (isMeetingHost && isThereNewRequests) toggleSchedulePanelEvent(true);
    }, [isMeetingHost, isThereNewRequests]);

    useEffect(() => {
        updateUserSocketEvent({
            doNotDisturb: doNotDisturbStore,
        });
    }, [doNotDisturbStore]);

    useEffect(() => {
        if (isAudioError) {
            setIsAudioActiveEvent(false); // This assumes setIsAudioActiveEvent will set isMicActive to false
        }
    }, [isAudioError]);

    const handleEndVideoChat = useCallback(async () => {
        disconnectFromVideoChatEvent();
        if (isSubdomain()) {
            await deleteDraftUsers();
            deleteUserAnonymousCookies();
            sendLeaveMeetingSocketEvent();
            window.location.href =
                config.frontendUrl + clientRoutes.registerEndCallRoute;
            return;
        }

        if (isRecording && meetingRecordingId) {
            stopRecordMeeting({ id: meetingRecordingId, url: fullUrl, byRequest: true, meetingId: meeting.id });
        }

        await router.push(
            !isWithoutAuthen
                ? localUser.isGenerated
                    ? clientRoutes.welcomeRoute
                    : clientRoutes.dashboardRoute
                : clientRoutes.registerEndCallRoute,
        );
    }, []);

    const handleToggleMic = useCallback(() => {
        if (isAudioError) {
            addNotificationEvent({
                type: NotificationType.MicAction,
                message: `meeting.deviceErrors.${audioError?.type}`,
            });
        } else {
            if (isMeetingConnected) {
                updateLocalUserEvent({
                    micStatus: isMicActive ? 'inactive' : 'active',
                });
                setDevicesPermission({
                    isMicEnabled: !isMicActive,
                });
                setIsAudioActiveEvent(!isMicActive);
            } else {
                addNotificationEvent({
                    type: NotificationType.validationError,
                    message: `meeting.connectionError}`,
                });
            }
        }
    }, [isMeetingConnected, isMicActive, isCamActive]);

    const handleToggleUsersPanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleUsersPanelEvent();
        toggleSchedulePanelEvent(false);
    };

    const handleToggleSchedulePanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleSchedulePanelEvent();
        toggleUsersPanelEvent(false);
    };

    const handleRequestToBecomeParticipant = useCallback(() => {
        requestSwitchRoleByAudienceEvent({ meetingId: meeting.id });
    }, []);

    const handleRecordMeeting = async () => {
        if (!isRecording) {
            startRecordMeeting({ url: fullUrl, byRequest: true, meetingId: meeting.id });
        } else {
            if (meetingRecordingId) {
                stopRecordMeeting({ id: meetingRecordingId, url: fullUrl, byRequest: true, meetingId: meeting.id });
            }

        }
    };

    const handleSetStickyNotesVisible = () => {
        setMeetingNotesVisibilityEvent({ isVisible: !isVisible });
    };

    const handleEmojiListToggle = () => {
        setEmojiListVisibilityEvent({ isEmojiListVisible: !isEmojiListVisible });
    }

    //Do not disturb acion
    const handleDoNotDisturb = () => {
        setDoNotDisturbEvent(!doNotDisturbStore);
    };

    const handleOpenSettingsDialog = () => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.devicesSettingsDialog
        })
    };

    const handleToggleSharing = () => {
        if (!meeting.sharingUserId) {
            startScreenSharing();
        } else if (isMeetingHost || isSharingScreenActive) {
            stopScreenSharing();
        }
    };

    const handleSharing = () => {
        if (isAbleToToggleSharing) {
            handleToggleSharing();
        }
    }

    return (
        <CustomGrid id="menuBar" container gap={1.5} className={styles.devicesWrapper}>
            <ConditionalRender condition={!isMobile && !isAudience}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="devices.stickyNotes"
                        />
                    }
                    placement="top"
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleSetStickyNotesVisible}
                            className={clsx(styles.deviceButton)}
                            Icon={
                                <NotesIcon
                                    width="22px"
                                    height="22px"
                                />
                            }
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>
            <ConditionalRender condition={!isMobile}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="devices.userReactions"
                        />
                    }
                    placement="top"
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleEmojiListToggle}
                            className={clsx(styles.deviceButton)}
                            Icon={
                                <FavoriteIcon fontSize="small" />
                            }
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>
            <ConditionalRender condition={!isMobile && !isAudience}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="devices.microphone"
                        />
                    }
                    placement="top"
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleToggleMic}
                            className={clsx(styles.deviceButton, {
                                [styles.inactive]: !isMicActive,
                            })}
                            Icon={
                                <MicIcon
                                    isActive={isMicActive}
                                    width="22px"
                                    height="22px"
                                />
                            }
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>
            <ConditionalRender condition={!isAudience}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="invite.tooltip"
                        />
                    }
                    placement="top"
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleToggleSchedulePanel}
                            className={clsx(styles.actionButton, {
                                [styles.active]: isSchedulePannelOpen,
                                [styles.newRequests]:
                                    (isThereNewRequests && isMeetingHost),
                                [styles.mobile]: isMobile,
                            })}
                            Icon={<PersonPlusIcon width="18px" height="18px" />}
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>

            <CustomTooltip
                title={
                    <Translation
                        nameSpace="meeting"
                        translation="chat.tooltip"
                    />
                }
                placement="top"
            >
                <CustomPaper
                    variant="black-glass"
                    borderRadius={8}
                    className={styles.deviceButton}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleToggleUsersPanel}
                        className={clsx(styles.actionButton, {
                            [styles.active]: isUsersOpen,
                            [styles.newRequests]: !!isThereNewMessage || !!isThereNewQuestion,
                            [styles.mobile]: isMobile,
                        })}
                        Icon={<ChatIcon width="18px" height="18px" />}
                    />
                </CustomPaper>
            </CustomTooltip>
            <ConditionalRender condition={isAudience}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="audience.buttons.requestBecomeParticipant"
                        />
                    }
                    placement="top"
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleRequestToBecomeParticipant}
                            className={styles.actionButton}
                            Icon={<ArrowUp width="15px" height="15px" />}
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>


            {/* Do not disturb button */}
            <ConditionalRender condition={isOwner}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="doNotDisturb.tooltip"
                        />
                    }
                    placement="top"
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleDoNotDisturb}
                            className={clsx(styles.deviceButton,
                                styles.doNotDisturbButton,
                                { [styles.disabled]: doNotDisturbStore }
                            )}
                            Icon={<DoNotDisturbAltIcon sx={{ fontSize: 20 }} />}
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>

            <CustomTooltip
                title={
                    <Translation
                        nameSpace="meeting"
                        translation="endMeeting.tooltip"
                    />
                }
                placement="top"
            >
                <ActionButton
                    variant="danger"
                    onAction={handleEndVideoChat}
                    className={styles.hangUpButton}
                    Icon={<HangUpIcon width="22px" height="22px" />}
                />
            </CustomTooltip>

            <ConditionalRender condition={!isAudience}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="settings.main"
                        />
                    }
                    placement="top"
                >
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={8}
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleOpenSettingsDialog}
                            className={styles.grey}
                            Icon={<SettingsIcon width="22px" height="22px" />}
                        />
                    </CustomPaper>
                </CustomTooltip>
            </ConditionalRender>

            <CustomGrid id="sideMenuBar" container gap={1.5} direction="column" className={styles.sideMenuWrapper}>
                <MeetingMonetizationButton />
                <ConditionalRender condition={!isAudience}>
                    <CustomTooltip
                        title={
                            <Translation
                                nameSpace="meeting"
                                translation={isAbleToToggleSharing ? `modes.screensharing.${isSharingActive ? 'off' : 'on'
                                    }` : 'modes.screensharing.busy'}
                            />
                        }
                        placement="top"
                    >
                        <CustomPaper
                            variant="black-glass"
                            borderRadius={8}
                            className={styles.deviceButton}
                        >
                            <ActionButton
                                variant="transparentBlack"
                                onAction={handleSharing}
                                className={clsx(styles.deviceButton)}
                                Icon={
                                    <SharingIcon width="22px" height="22px" className={clsx({ [styles.active]: isSharingActive && isAbleToToggleSharing })} />
                                }
                            />
                        </CustomPaper>
                    </CustomTooltip>
                </ConditionalRender>
                <ConditionalRender condition={isOwner}>
                    <CustomTooltip
                        title={
                            <Translation
                                nameSpace="meeting"
                                translation={
                                    isAudience
                                        ? isRecording
                                            ? "recordMeeting.noAccess"
                                            : "recordMeeting.recordingRequest"
                                        : isRecording
                                            ? "recordMeeting.stop"
                                            : "recordMeeting.start"
                                }
                            />
                        }
                        placement="top"
                    >
                        <CustomPaper
                            variant="black-glass"
                            borderRadius={8}
                            className={styles.deviceButton}
                        >
                            <ActionButton
                                variant="transparentBlack"
                                onAction={handleRecordMeeting}
                                className={styles.deviceButton}
                                disabled={isAudience && isRecording}
                                Icon={
                                    (recordingStartPending || recordingStopPending || meetingRecordingStore.isStopRecordingPending)
                                        ? <CircularProgress
                                            size={15}
                                            sx={{ color: 'white' }}
                                        />
                                        : isRecording
                                            ? <FiberManualRecordIcon color="error" className={styles.recordingBtnAnimation} />
                                            : <FiberManualRecordIcon />
                                }
                            />
                        </CustomPaper>
                    </CustomTooltip>
                </ConditionalRender>
            </CustomGrid>
        </CustomGrid>
    );
};

export const MeetingControlButtons = memo(Component);
