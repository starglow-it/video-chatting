import { memo, SyntheticEvent, useCallback, useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';
import { useRouter } from 'next/router';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

//hooks
import { FormProvider, useForm } from 'react-hook-form';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// common
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { UserRoles } from 'shared-types';
import { MeetingGeneralInfo } from '@components/Meeting/MeetingGeneralInfo/MeetingGeneralInfo';
import { Fade } from '@mui/material';
import { ClickAwayListener } from '@mui/base';

// icons
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { ChatIcon } from 'shared-frontend/icons/OtherIcons/ChatIcon';
import { NotesIcon } from 'shared-frontend/icons/OtherIcons/NotesIcon';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CircularProgress from '@mui/material/CircularProgress';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import * as yup from 'yup';
import { Theme } from '@mui/system';
import createStyles from '@mui/styles/createStyles';
import { makeStyles } from '@mui/styles';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// icons
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import CallEndIcon from '@mui/icons-material/CallEnd';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import { simpleStringSchemaWithLength } from '../../../validation/common';
import { MAX_NOTE_CONTENT } from '../../../const/general';
import { PaymentType } from 'shared-const';

// stores
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { Translation } from '@library/common/Translation/Translation';
import { isSubdomain } from 'src/utils/functions/isSubdomain';
import { deleteUserAnonymousCookies } from 'src/helpers/http/destroyCookies';
import { PersonPlusIcon } from 'shared-frontend/icons/OtherIcons/PersonPlusIcon';
import { ArrowUp } from 'shared-frontend/icons/OtherIcons/ArrowUp';
import { $authStore, addNotificationEvent, deleteDraftUsers } from '../../../store';
import { PlanKeys } from 'shared-types';
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
    $meetingEmojiListVisibilityStore,
    setEmojiListVisibilityEvent,
    $meetingStore,
    $meetingRecordingStore,
    $meetingRecordingIdStore,
    $isToggleEditRuumePanel,
    $isTogglProfilePanel,
    $isToggleNoteEmojiListPanel,
    $enabledPaymentMeetingParticipant,
    $enabledPaymentMeetingAudience,
    $paymentIntent,
    $isAITranscriptEnabledStore,
    $transcriptionsStore,
    createPaymentIntentWithData,
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
    $meetingNotesStore,
    sendMeetingNoteSocketEvent,
    toggleEditRuumeSettingEvent,
    toggleProfilePanelEvent,
    toggleNoteEmojiListPanelEvent,
    setAITranscriptEvent,
    sendAiTranscription,
    aiTranscriptionOnEvent,
    setActiveTabPanelEvent
} from '../../../store/roomStores';

import { $isPortraitLayout, $profileStore } from '../../../store';

// styles
import styles from './MeetingControlButtons.module.scss';
import { clientRoutes } from '../../../const/client-routes';
import config from '../../../const/config';
import { NotificationType } from 'src/store/types';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

const validationSchema = yup.object({
    note: simpleStringSchemaWithLength(MAX_NOTE_CONTENT).required('required'),
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                    color: '#77777a',
                },
            },
            '& .MuiOutlinedInput-root': {
                background: 'transparent',
                color: 'white',
                '&.Mui-focused, &:hover': {
                    color: '#b5b5b5',
                },
                height: '30px',
                fontSize: '18px'
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '8px',
                border: 'none'
            },
            '& .MuiFormLabel-root': {
                color: 'black',
                top: '-8px',
                fontSize: '14px',
            },
            '& .Mui-focused': {
                top: 0,
            },
            '& .MuiFormLabel-filled': {
                top: 0,
            },
        },
    }),
);

type FormType = { note: string };

const Component = () => {
    const router = useRouter();
    const fullUrl = typeof window !== 'undefined' ? window.location.href : '';

    const isMeetingHost = useStore($isMeetingHostStore);
    const localUser = useStore($localUserStore);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const { isWithoutAuthen } = useStore($authStore);
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isNoteEmojiListPanelOpen = useStore($isToggleNoteEmojiListPanel);
    const isSchedulePannelOpen = useStore($isToggleSchedulePanel);
    const isAudience = useStore($isAudience);
    const isOwner = useStore($isOwner);
    const meeting = useStore($meetingStore);
    const meetingRecordingId = useStore($meetingRecordingIdStore);
    const meetingRecordingStore = useStore($meetingRecordingStore);
    const recordingStartPending = useStore(startRecordStreamFx.pending);
    const recordingStopPending = useStore(stopRecordStreamFx.pending);
    const isEditRuumeSettingPanelOpen = useStore($isToggleEditRuumePanel);
    const isProfileOpen = useStore($isTogglProfilePanel);
    const enabledPaymentMeetingAudience = useStore($enabledPaymentMeetingAudience);

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
    const { isEmojiListVisible } = useStore($meetingEmojiListVisibilityStore);
    const isRecording = useStore($isRecordingStore);
    const doNotDisturbStore = useStore($doNotDisturbStore);
    const isSharingActive = useStore($isScreenSharingStore);
    const isSharingScreenActive = localUser.id === meeting.sharingUserId;
    const isAbleToToggleSharing =
        isMeetingHost || isSharingScreenActive || !meeting.sharingUserId;
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );
    const paymentIntent = useStore($paymentIntent);
    const intentId = paymentIntent?.id;
    const enabledPaymentMeetingParticipant = useStore(
        $enabledPaymentMeetingParticipant,
    );
    const isNoteEmojiListOpen = useStore($isToggleNoteEmojiListPanel);
    const isPortraitLayout = useStore($isPortraitLayout);

    const materialStyles = useStyles();
    const meetingNotes = useStore($meetingNotesStore);
    const profile = useStore($profileStore);
    const isSubscriptionPlanHouse = profile.subscriptionPlanKey === PlanKeys.House;
    const isAITranscriptEnabled = useStore($isAITranscriptEnabledStore);
    const resolver = useYupValidationResolver<FormType>(validationSchema);
    const transcriptionsStore = useStore($transcriptionsStore);
    const isAiTranscriptEnabled = useStore($isAITranscriptEnabledStore);

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
        if (isAiTranscriptEnabled) {
            sendAiTranscription({ script: transcriptionsStore });
            setAITranscriptEvent(false);
        }
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
    }, [isAiTranscriptEnabled, transcriptionsStore]);

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

    const handleTogglePayment = () => {
        if (!isCreatePaymentIntentPending) {
            if (!intentId &&
                (enabledPaymentMeetingAudience || enabledPaymentMeetingParticipant)
            ) {
                createPaymentIntentWithData({
                    paymentType: PaymentType.Meeting,
                });
            }
        }
    };

    const handleToggleUsersPanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleUsersPanelEvent();
        setActiveTabPanelEvent(0);

        if (isProfileOpen) {
            toggleProfilePanelEvent(false);
        }

        if (isEmojiListVisible) {
            setEmojiListVisibilityEvent({ isEmojiListVisible: false });
        }

        if (isSchedulePannelOpen) {
            toggleSchedulePanelEvent(false);
        }

        if (isEditRuumeSettingPanelOpen) {
            toggleEditRuumeSettingEvent(false);
        }

        if (isNoteEmojiListOpen) {
            toggleNoteEmojiListPanelEvent(false);
        }
    };

    const handleToggleSchedulePanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleSchedulePanelEvent();
        if (isProfileOpen) {
            toggleProfilePanelEvent(false);
        }

        if (isEmojiListVisible) {
            setEmojiListVisibilityEvent({ isEmojiListVisible: false });
        }

        if (isUsersOpen) {
            toggleUsersPanelEvent(false);
        }

        if (isEditRuumeSettingPanelOpen) {
            toggleEditRuumeSettingEvent(false);
        }

        if (isNoteEmojiListOpen) {
            toggleNoteEmojiListPanelEvent(false);
        }
    };

    const handleToggleEditRuumeSettingPanel = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleEditRuumeSettingEvent();

        if (isProfileOpen) {
            toggleProfilePanelEvent(false);
        }

        if (isEmojiListVisible) {
            setEmojiListVisibilityEvent({ isEmojiListVisible: false });
        }

        if (isUsersOpen) {
            toggleUsersPanelEvent(false);
        }

        if (isSchedulePannelOpen) {
            toggleSchedulePanelEvent(false);
        }

        if (enabledPaymentMeetingAudience) {
            handleTogglePayment();
        }

        if (isNoteEmojiListOpen) {
            toggleNoteEmojiListPanelEvent(false);
        }
    };

    const handleNoteEmojiListToggle = (e: SyntheticEvent) => {
        e.stopPropagation();
        toggleNoteEmojiListPanelEvent(!isNoteEmojiListPanelOpen);

        if (isEmojiListVisible) {
            setEmojiListVisibilityEvent({ isEmojiListVisible: false });
        }

        if (isProfileOpen) {
            toggleProfilePanelEvent(false);
        }

        if (isEditRuumeSettingPanelOpen) {
            toggleEditRuumeSettingEvent(false);
        }

        if (isUsersOpen) {
            toggleUsersPanelEvent(false);
        }

        if (isSchedulePannelOpen) {
            toggleSchedulePanelEvent(false);
        }
    }

    const handleEmojiListToggle = (e: SyntheticEvent) => {
        e.stopPropagation();
        setEmojiListVisibilityEvent({ isEmojiListVisible: !isEmojiListVisible });

        if (isProfileOpen) {
            toggleProfilePanelEvent(false);
        }

        if (isEditRuumeSettingPanelOpen) {
            toggleEditRuumeSettingEvent(false);
        }

        if (isUsersOpen) {
            toggleUsersPanelEvent(false);
        }

        if (isSchedulePannelOpen) {
            toggleSchedulePanelEvent(false);
        }

        if (isNoteEmojiListOpen) {
            toggleNoteEmojiListPanelEvent(false);
        }
    }

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

    const handleToggleSharing = () => {
        console.log(meeting.sharingUserId);
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

    const handleAiTranscript = () => {
        if (!isSubscriptionPlanHouse) {
            if (!isAITranscriptEnabled) {
                aiTranscriptionOnEvent();
            }
            setAITranscriptEvent(!isAITranscriptEnabled);
        }
    }

    const methods = useForm({
        resolver,
        defaultValues: { note: '' },
    });

    const { reset, register, getValues, setValue } = methods;

    const [isExpand, setIsExpand] = useState<boolean>(true);

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' || e.keyCode === '13') {
            if (meetingNotes.length < 3) {
                sendMeetingNoteSocketEvent(getValues());
                reset();
            } else {
                addNotificationEvent({
                    message: 'Notes is limited to 3 on screen',
                    type: NotificationType.validationError,
                });
            }
        }
    };

    const { onChange, ...restRegisterData } = register('note', {
        maxLength: MAX_NOTE_CONTENT,
    });

    const handleChange = useCallback(async (event: any) => {
        if (event.target.value.length > MAX_NOTE_CONTENT) {
            /* eslint-disable no-param-reassign */
            event.target.value = event.target.value.slice(0, MAX_NOTE_CONTENT);
            /* eslint-enable no-param-reassign */
        }

        await onChange(event);
    }, []);

    const sendNote = () => {
        if (meetingNotes.length < 3) {
            sendMeetingNoteSocketEvent(getValues());
            reset();
        } else {
            addNotificationEvent({
                message: 'Notes is limited to 3 on screen',
                type: NotificationType.validationError,
            });
        }
    };

    const handleCloseNoteEmojiListPanel = useCallback((e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        toggleNoteEmojiListPanelEvent(false);
    }, []);

    const handleChooseEmoji = (data: EmojiClickData) => {
        const currentValue = getValues('note');
        setValue('note', currentValue + data.emoji);
    };

    return (
        <CustomGrid id="menuBar" container alignItems="center" className={styles.devicesWrapper}>
            <CustomGrid
                item
                className={styles.profileAvatar}
            >
                <MeetingGeneralInfo />
            </CustomGrid>
            <ConditionalRender condition={!isMobile && !isAudience}>
                <FormProvider {...methods}>
                    <CustomPaper
                        className={clsx(styles.commonOpenPanel, {
                            [styles.mobile]: isMobile,
                        })}
                    >
                        <CustomGrid
                            container
                            alignItems="center"
                            flexDirection="row"
                            justifyContent="center"
                        >
                            <CustomGrid flex={1}>
                                <ConditionalRender
                                    condition={!isAudience || !!profile.id}
                                >
                                    <CustomInput
                                        placeholder="post a sticky note"
                                        className={clsx(
                                            materialStyles.textField,
                                            styles.textField,
                                            { [styles.expanded]: isExpand },
                                        )}
                                        onKeyDown={handleKeyDown}
                                        {...restRegisterData}
                                        onChange={handleChange}
                                    />
                                </ConditionalRender>
                                <ConditionalRender
                                    condition={isAudience && !!!profile.id}
                                >
                                    <CustomGrid
                                        className={styles.fieldNoLogin}
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <span>
                                            <a
                                                href={`${config.frontendUrl}/register`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Join
                                            </a>{' '}
                                            to Post a Sticky Note
                                        </span>
                                    </CustomGrid>
                                </ConditionalRender>
                            </CustomGrid>
                            <ClickAwayListener onClickAway={handleCloseNoteEmojiListPanel}>
                                <Fade in={isNoteEmojiListOpen}>
                                    <CustomPaper
                                        className={clsx(styles.noteEmojiListPanel, {
                                            [styles.mobile]: isMobile && isPortraitLayout,
                                            [styles.landscape]:
                                                isMobile && !isPortraitLayout,
                                        })}
                                    >
                                        <EmojiPicker
                                            searchDisabled
                                            onEmojiClick={handleChooseEmoji}
                                            previewConfig={{ showPreview: false }}
                                        />
                                    </CustomPaper>
                                </Fade>
                            </ClickAwayListener>
                            <ActionButton
                                variant="transparentPure"
                                className={clsx(styles.stickyEmojiBtn, {
                                    [styles.disabled]: isAudience && !!!profile.id,
                                })}
                                Icon={<InsertEmoticonIcon sx={{ fontSize: '25px' }} />}
                                onClick={handleNoteEmojiListToggle}
                            />
                            <ActionButton
                                variant="transparentPure"
                                className={clsx(styles.sendNoteBtn, {
                                    [styles.disabled]: isAudience && !!!profile.id,
                                })}
                                Icon={<NotesIcon width='25px' height='25px' />}
                                onClick={sendNote}
                            />
                        </CustomGrid>
                    </CustomPaper>
                </FormProvider>
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
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleEmojiListToggle}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={
                                <FavoriteIcon width="25px" height="25px" />
                            }
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="controlButtonsLabel.reactions"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
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
                <CustomGrid
                    className={styles.deviceButton}
                    onClick={handleToggleUsersPanel}
                >
                    <ActionButton
                        variant="transparentPure"
                        className={clsx(styles.actionButton, styles.actionBtn, {
                            [styles.active]: isUsersOpen,
                            [styles.newRequests]: !!isThereNewMessage || !!isThereNewQuestion,
                            [styles.mobile]: isMobile,
                        })}
                        Icon={<ChatIcon width="25px" height="25px" />}
                    />
                    <CustomTypography
                        nameSpace="meeting"
                        translation="controlButtonsLabel.chat"
                        color="white"
                        fontSize={12}
                    />
                </CustomGrid>
            </CustomTooltip>
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
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleSharing}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={
                                <ScreenShareIcon width="25px" height="25px" className={clsx({ [styles.active]: isSharingActive && isAbleToToggleSharing })} />
                            }
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="controlButtonsLabel.screenSharing"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomTooltip>
            </ConditionalRender>
            <ConditionalRender condition={isOwner}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation={isSubscriptionPlanHouse? "upgratePlan" : isAITranscriptEnabled ? "aiTranscriptOn" : "aiTranscriptOff"}
                        />
                    }
                    placement="top"
                >
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleAiTranscript}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={
                                <CustomTypography className={clsx(styles.aiTranscript, { [styles.activeText]: !isSubscriptionPlanHouse && isAITranscriptEnabled })} >Ai</CustomTypography>
                            }
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation={isAITranscriptEnabled ? 'on' : 'off'}
                            color={isSubscriptionPlanHouse ? "#808080" : isAITranscriptEnabled ? "orange" : "#808080"}
                            fontSize={12}
                        />
                    </CustomGrid>
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
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleToggleMic}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={clsx(styles.actionBtn, {
                                [styles.inactive]: !isMicActive,
                            })}
                            Icon={
                                <MicIcon
                                    isActive={isMicActive}
                                    width="25px"
                                    height="25px"
                                />
                            }
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="controlButtonsLabel.audio"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomTooltip>
            </ConditionalRender>
            <ConditionalRender condition={isOwner && profile.role !== UserRoles.Anonymous}>
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
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleRecordMeeting}
                    >
                        <ActionButton
                            variant="transparentPure"
                            disabled={isAudience && isRecording}
                            className={styles.actionBtn}
                            Icon={
                                (recordingStartPending || recordingStopPending || meetingRecordingStore.isStopRecordingPending)
                                    ? <CircularProgress
                                        size={25}
                                        sx={{ color: 'white' }}
                                    />
                                    : isRecording
                                        ? <FiberManualRecordIcon
                                            width="25px"
                                            height="25px"
                                            color="error"
                                            className={styles.recordingBtnAnimation}
                                        />
                                        : <FiberManualRecordIcon width="25px" height="25px" />
                            }
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="controlButtonsLabel.record"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
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
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleToggleSchedulePanel}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={clsx(styles.actionButton, styles.actionBtn, {
                                [styles.active]: isSchedulePannelOpen,
                                [styles.newRequests]:
                                    (isThereNewRequests && isMeetingHost),
                                [styles.mobile]: isMobile,
                            })}
                            Icon={<PersonPlusIcon width="25px" height="25px" />}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="controlButtonsLabel.attendees"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomTooltip>
            </ConditionalRender>
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
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleRequestToBecomeParticipant}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={clsx(styles.actionButton, styles.actionBtn)}
                            Icon={<ArrowUp width="25px" height="25px" />}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="controlButtonsLabel.becomeAParticipant"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
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
                <CustomGrid
                    className={styles.deviceButton}
                    onClick={handleEndVideoChat}
                >
                    <ActionButton
                        variant="transparentPure"
                        className={styles.hangUpButton}
                        Icon={<CallEndIcon width="25px" height="25px" sx={{ color: 'red' }} />}
                    />
                    <CustomTypography
                        nameSpace="meeting"
                        translation="controlButtonsLabel.end"
                        color="white"
                        fontSize={12}
                    />
                </CustomGrid>

            </CustomTooltip>
            <ConditionalRender condition={!isAudience}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="buttons.more"
                        />
                    }
                    placement="top"
                >
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleToggleEditRuumeSettingPanel}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={<MoreHorizIcon width="25px" height="25px" />}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="buttons.more"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomTooltip>
            </ConditionalRender>
            <ConditionalRender condition={(isAudience && enabledPaymentMeetingAudience)}>
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="buttons.more"
                        />
                    }
                    placement="top"
                >
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleToggleEditRuumeSettingPanel}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={<AttachMoneyIcon width="25px" height="25px" />}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="buttons.payDonate"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomTooltip>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const MeetingControlButtons = memo(Component);
