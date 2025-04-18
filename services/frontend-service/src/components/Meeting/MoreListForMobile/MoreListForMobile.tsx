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
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// icons
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { ChatIcon } from 'shared-frontend/icons/OtherIcons/ChatIcon';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CircularProgress from '@mui/material/CircularProgress';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HelpIcon from '@mui/icons-material/Help';
import NoteIcon from '@mui/icons-material/Note';
import LinkIcon from '@mui/icons-material/Link';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';

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
    $isParticipant,
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
    initialMeetingPanelsVisibilityData,
    setMeetingPanelsVisibilityForMobileEvent,
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
    setActiveTabPanelEvent,
    setDoNotDisturbEvent
} from '../../../store/roomStores';
import { $transcriptionQueue } from '../../../store/roomStores';

import { $isPortraitLayout, $profileStore } from '../../../store';

// styles
import styles from './MoreListForMobile.module.scss';
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
    const isParticipant = useStore($isParticipant);
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
    const isSubscriptionPlanBusiness = profile.subscriptionPlanKey === PlanKeys.Business;
    const isAITranscriptEnabled = useStore($isAITranscriptEnabledStore);
    const resolver = useYupValidationResolver<FormType>(validationSchema);
    const transcriptionsStore = useStore($transcriptionsStore);
    const isAiTranscriptEnabled = useStore($isAITranscriptEnabledStore);
    const transcriptionQueue = useStore($transcriptionQueue);

    function deduplicateText(input: string) {
        const tokens = input.split(/\W+/);
        const seen = new Set();
        const result: any = [];

        tokens.forEach(token => {
            const phrase = token.toLowerCase();
            if (!seen.has(phrase) && phrase.trim() !== "") {
                seen.add(phrase);
                result.push(token);
            }
        });

        return result.join(" ");
    }

    const transcriptionList = transcriptionQueue.map((element: any) => ({
        body: deduplicateText(element.message),
        id: element.sender + new Date().getTime(),
        sender: {
            id: element.sender,
            username: element.sender,
            profileAvatar: '',
        },
    }));

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
        if (isSubscriptionPlanBusiness) {
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

    const handleOpenChatPanel = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        setMeetingPanelsVisibilityForMobileEvent({
            ...initialMeetingPanelsVisibilityData,
            isMobileMoreListVisible: false,
            isMobileChatPanelVisible: true
        });
    }, []);

    const handleOpenQAPanel = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        setMeetingPanelsVisibilityForMobileEvent({
            ...initialMeetingPanelsVisibilityData,
            isMobileMoreListVisible: false,
            isMobileQAPanleVisible: true
        });
    }, []);

    const handleOpenNotesPanel = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        setMeetingPanelsVisibilityForMobileEvent({
            ...initialMeetingPanelsVisibilityData,
            isMobileMoreListVisible: false,
            isMobileStickyNotesVisible: true
        });
    }, []);

    const handleOpenLinksPanel = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        setMeetingPanelsVisibilityForMobileEvent({
            ...initialMeetingPanelsVisibilityData,
            isMobileMoreListVisible: false,
            isMobileLinksPanleVisible: true
        });
    }, []);

    const handleOpenSettingPanel = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
        setMeetingPanelsVisibilityForMobileEvent({
            ...initialMeetingPanelsVisibilityData,
            isMobileMoreListVisible: false,
            isMobileSettingPanelVisible: true
        });
    }, []);

    const handleDoNotDisturb = () => {
        setDoNotDisturbEvent(!doNotDisturbStore);
    };

    return (
        <CustomGrid
            id="menuBar"
            container
            alignItems="center"
            justifyContent={isOwner ? 'space-between' : 'center'}
            className={styles.devicesWrapper}
        >
            <CustomGrid item xs={isParticipant ? 3 : 4}>
                <CustomGrid
                    className={styles.deviceButton}
                    onClick={handleOpenChatPanel}
                >
                    <ActionButton
                        variant="transparentPure"
                        className={styles.actionBtn}
                        Icon={<ChatIcon width="30px" height="30px" />}
                    />
                    <CustomTypography
                        nameSpace="meeting"
                        translation="mobileMoreList.chat"
                        color="white"
                        fontSize={12}
                    />
                </CustomGrid>
            </CustomGrid>
            <ConditionalRender condition={isOwner}>
                <CustomGrid item xs={isParticipant ? 3 : 4}>
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleSharing}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={<ScreenShareIcon sx={{ width: '30px', height: '30px' }} />}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="mobileMoreList.screenshare"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={isOwner}>
                <CustomGrid item xs={isParticipant ? 3 : 4}>
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleOpenQAPanel}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={<HelpIcon sx={{ width: '30px', height: '30px' }} />}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="mobileMoreList.q&a"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomGrid>
            </ConditionalRender>
            <CustomGrid item xs={isParticipant ? 3 : 4}>
                <CustomGrid
                    className={styles.deviceButton}
                    onClick={handleOpenNotesPanel}
                >
                    <ActionButton
                        variant="transparentPure"
                        className={styles.actionBtn}
                        Icon={<NoteIcon sx={{ width: '30px', height: '30px' }} />}
                    />
                    <CustomTypography
                        nameSpace="meeting"
                        translation="mobileMoreList.stickynotes"
                        color="white"
                        fontSize={12}
                    />
                </CustomGrid>
            </CustomGrid>
            <ConditionalRender condition={isParticipant || isAudience}>
                <CustomGrid item xs={isParticipant ? 3 : 4}>
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleOpenQAPanel}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={<HelpIcon sx={{ width: '30px', height: '30px' }} />}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="mobileMoreList.q&a"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={enabledPaymentMeetingParticipant}>
                <CustomGrid item xs={isParticipant ? 3 : 4}>
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleOpenLinksPanel}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={<LinkIcon sx={{ width: '30px', height: '30px' }} />}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="mobileMoreList.links"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={isOwner}>
                <CustomGrid item xs={isParticipant ? 3 : 4}>
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleRecordMeeting}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={
                                (recordingStartPending || recordingStopPending || meetingRecordingStore.isStopRecordingPending)
                                    ? <CircularProgress
                                        size={30}
                                        sx={{ color: 'white' }}
                                    />
                                    : isRecording
                                        ? <FiberManualRecordIcon
                                            sx={{ width: '30px', height: '30px' }}
                                            color="error"
                                            className={styles.recordingBtnAnimation}
                                        />
                                        : <FiberManualRecordIcon sx={{ width: '30px', height: '30px' }} />
                            }
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="mobileMoreList.record"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={isOwner}>
                <CustomGrid item xs={isParticipant ? 3 : 4}>
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleAiTranscript}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={<CustomTypography
                                className={clsx(styles.aiTranscript,
                                    {
                                        [styles.activeText]: isSubscriptionPlanBusiness
                                            && isAITranscriptEnabled
                                    })}
                            >
                                Ai
                            </CustomTypography>}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="mobileMoreList.ai"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={isOwner}>
                <CustomGrid item xs={isParticipant ? 3 : 4}>
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleOpenLinksPanel}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={styles.actionBtn}
                            Icon={<LinkIcon sx={{ width: '30px', height: '30px' }} />}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="mobileMoreList.links"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={isOwner}>
                <CustomGrid item xs={isParticipant ? 3 : 4}>
                    <CustomGrid
                        className={styles.deviceButton}
                        onClick={handleDoNotDisturb}
                    >
                        <ActionButton
                            variant="transparentPure"
                            className={clsx(styles.actionBtn)}
                            Icon={<DoNotDisturbIcon sx={{ width: '30px', height: '30px', color: doNotDisturbStore ? '#EF8E5B' : 'white' }} />}
                        />
                        <CustomTypography
                            nameSpace="meeting"
                            translation="mobileMoreList.donotdisturb"
                            color="white"
                            fontSize={12}
                        />
                    </CustomGrid>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={!isAudience}>
                <CustomGrid
                    item
                    xs={isParticipant ? 3 : 4}
                    sx={{ marginTop: '-15px' }}
                    onClick={handleOpenSettingPanel}
                >
                    <ProfileAvatar
                        src={profile?.profileAvatar?.url}
                        userName={profile.fullName}
                        className={clsx(styles.profileImage, styles.linkIcon)}
                    />
                </CustomGrid>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const MoreListForMobile = memo(Component);
