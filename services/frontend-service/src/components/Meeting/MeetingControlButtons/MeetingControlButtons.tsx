import { memo, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';
import { useRouter } from 'next/router';

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
import { MeetingGeneralInfo } from '@components/Meeting/MeetingGeneralInfo/MeetingGeneralInfo';

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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import * as yup from 'yup';
import { Theme } from '@mui/system';
import createStyles from '@mui/styles/createStyles';
import { makeStyles } from '@mui/styles';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { SendIcon } from 'shared-frontend/icons/OtherIcons/SendIcon';

// custom
import { CustomInput } from '@library/custom/CustomInput/CustomInput';

// icons
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

// validation

// stores

// styles
import { $profileStore } from 'src/store';
import { simpleStringSchemaWithLength } from '../../../validation/common';
import { MAX_NOTE_CONTENT } from '../../../const/general';

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
    $meetingNotesStore,
    sendMeetingNoteSocketEvent,
    toggleEditRuumeSettingEvent
} from '../../../store/roomStores';

// styles
import styles from './MeetingControlButtons.module.scss';
import { clientRoutes } from '../../../const/client-routes';
import config from '../../../const/config';
import { MeetingMonetizationButton } from '../MeetingMonetization/MeetingMonetizationButton';
import { AppDialogsEnum, NotificationType } from 'src/store/types';
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
                color: '#737373',
                '&.Mui-focused, &:hover': {
                    color: '#737373',
                },
                height: '30px',
                fontSize: '14px'
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

    const materialStyles = useStyles();
    const meetingNotes = useStore($meetingNotesStore);
    const profile = useStore($profileStore);
    const resolver = useYupValidationResolver<FormType>(validationSchema);

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

    const methods = useForm({
        resolver,
        defaultValues: { note: '' },
    });

    const { reset, register, getValues } = methods;

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
                                        placeholder="post a sticky notes"
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
                            <ActionButton
                                variant="transparentBlack"
                                className={clsx({
                                    [styles.disabled]: isAudience && !!!profile.id,
                                })}
                                Icon={<InsertEmoticonIcon sx={{ fontSize: '30px' }} />}
                                onClick={() => { }}
                            />
                            <ActionButton
                                variant="transparentBlack"
                                className={clsx({
                                    [styles.disabled]: isAudience && !!!profile.id,
                                })}
                                Icon={<NotesIcon width='30px' height='30px' />}
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
                    >
                        <ActionButton
                            variant="transparentBlack"
                            className={styles.actionBtn}
                            onAction={handleEmojiListToggle}
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
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleToggleUsersPanel}
                        className={clsx(styles.actionButton, {
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
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleSharing}
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
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleToggleMic}
                            className={clsx({
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
                    <CustomGrid
                        className={styles.deviceButton}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleRecordMeeting}
                            disabled={isAudience && isRecording}
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
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleRequestToBecomeParticipant}
                            className={styles.actionButton}
                            Icon={<ArrowUp width="25px" height="25px" />}
                        />
                    </CustomGrid>
                </CustomTooltip>
            </ConditionalRender>


            {/* Do not disturb button */}
            {/* <ConditionalRender condition={isOwner}>
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
            </ConditionalRender> */}

            <CustomTooltip
                title={
                    <Translation
                        nameSpace="meeting"
                        translation="endMeeting.tooltip"
                    />
                }
                placement="top"
            >
                <CustomGrid className={styles.deviceButton}>
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleEndVideoChat}
                        className={styles.hangUpButton}
                        Icon={<HangUpIcon width="25px" height="25px" />}
                    />
                    <CustomTypography
                        nameSpace="meeting"
                        translation="controlButtonsLabel.end"
                        color="white"
                        fontSize={12}
                    />
                </CustomGrid>

            </CustomTooltip>

            <ConditionalRender condition={true}>
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
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={() => toggleEditRuumeSettingEvent()}
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

            {/* <ConditionalRender condition={!isAudience}>
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
            </ConditionalRender> */}

            {/* <CustomGrid id="sideMenuBar" container gap={1.5} direction="column" className={styles.sideMenuWrapper}>
                <MeetingMonetizationButton />


            </CustomGrid> */}
        </CustomGrid>
    );
};

export const MeetingControlButtons = memo(Component);
