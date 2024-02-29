import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { Fade } from '@mui/material';
import { ClickAwayListener } from '@mui/base';
import CopyToClipboard from 'react-copy-to-clipboard';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { Translation } from '@library/common/Translation/Translation';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CopyIcon } from 'shared-frontend/icons/OtherIcons/CopyIcon';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

//@mui
import Divider from '@mui/material/Divider';

// icons
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';

// components
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { MeetingInviteParticipants } from '@components/Meeting/MeetingInviteParticipants/MeetingInviteParticipants';
import { MeetingAttendeesList } from '@components/Meeting/MeetingAttendeesList/MeetingAttendeesList';
import { UsersAvatarsCounter } from '@library/common/UsersAvatarsCounter/UsersAvatarsCounter';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// stores
import { PaymentForm } from '@components/PaymentForm/PaymentForm';
import { $isPortraitLayout, setIsSideUsersOpenEvent } from '../../../store';
import {
    $enabledPaymentMeetingAudience,
    $enabledPaymentMeetingParticipant,
    $isOwner,
    $isScreenSharingStore,
    $isToggleBackgroundPanel,
    $isTogglePayment,
    $isToggleSchedulePanel,
    $isRecordingUrlsListPanel,
    $isToggleUsersPanel,
    $meetingUsersStore,
    $paymentIntent,
    $paymentMeetingAudience,
    $paymentMeetingParticipant,
    $meetingRecordingStore,
    $meetingStore,
    $isAudience,
    startRecordStreamFx,
    cancelPaymentIntentWithData,
    toggleBackgroundManageEvent,
    togglePaymentFormEvent,
    toggleSchedulePanelEvent,
    toggleUsersPanelEvent,
    toggleRecordingUrlsListPanel,
    requestRecordingRejectEvent,
    startRecordMeeting,
    recordingStartPendingEvent,
    getRecordingUrl
} from '../../../store/roomStores';
import { addNotificationEvent } from '../../../store';
import { $avatarsMeetingStore } from 'src/store/roomStores/meeting/meetingAvatar/model';
import { NotificationType } from '../../../store/types';

// styles
import styles from './MeetingControlPanel.module.scss';

// types
import { MeetingUser } from '../../../store/types';
import { MeetingPeople } from '../MeetingPeople/MeetingPeople';
import { MeetingMonetization } from '../MeetingMonetization/MeetingMonetization';
import { MeetingChangeBackground } from '../MeetingChangeBackground/MeetingChangeBackground';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';

import { getAvatarUrlMeeting } from 'src/utils/functions/getAvatarMeeting';

function formatText(text: string): string {
    if (text.length <= 24) {
        return text;
    } else {
        return '...' + text.substring(text.length - 25);
    }
}

const Component = () => {
    const isOwner = useStore($isOwner);
    const paymentIntent = useStore($paymentIntent);
    const isScreenSharing = useStore($isScreenSharingStore);
    const users = useStore($meetingUsersStore);
    const isPaymentOpen = useStore($isTogglePayment);
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isPortraitLayout = useStore($isPortraitLayout);
    const isScheduleOpen = useStore($isToggleSchedulePanel);
    const isRecordingUrlsListPanel = useStore($isRecordingUrlsListPanel);
    const isChangeBackgroundOpen = useStore($isToggleBackgroundPanel);
    const enabledPaymentMeetingParticipant = useStore(
        $enabledPaymentMeetingParticipant,
    );
    const enabledPaymentMeetingAudience = useStore($enabledPaymentMeetingAudience);
    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);
    const paymentMeetingAudience = useStore($paymentMeetingAudience);
    const meetingRecordingStore = useStore($meetingRecordingStore);
    const meeting = useStore($meetingStore);
    const isAudience = useStore($isAudience);
    const recordingStartPending = useStore(startRecordStreamFx.pending);
    const [isRecordingRequestReceived, setIsRecordingRequestReceived] = useState(false);
    const [isParticipantsPanelShow, setIsParticipantPanelShow] = useState(true);

    const { isMobile } = useBrowserDetect();
    const fullUrl = typeof window !== 'undefined' ? window.location.href : '';
    const [ isCopyEnabled, setIsCopyEnabled ] = useState(false);

    const {
        avatar: { list },
    } = useStore($avatarsMeetingStore);

    useEffect(() => {
        if (meetingRecordingStore.requestUsers.length > 0) {
            setIsRecordingRequestReceived(true);
        } else {
            setIsRecordingRequestReceived(false);
        }

        if (meetingRecordingStore.urlForCopy !== '' && isCopyEnabled) {
            navigator.clipboard.writeText(meetingRecordingStore.urlForCopy);
            addNotificationEvent({
                type: NotificationType.LinkInfoCopied,
                message: 'meeting.copy.link',
            });

            if (isCopyEnabled) {
                setIsCopyEnabled(false);
            }
        }
    }, [meetingRecordingStore, isCopyEnabled]);

    useEffect(() => {
        if (recordingStartPending) {
            recordingStartPendingEvent({ meetingId: meeting.id });
        }
    }, [recordingStartPending]);

    const handleClosePayment = useCallback(async () => {
        if (paymentIntent?.id) {
            cancelPaymentIntentWithData();
        }
        togglePaymentFormEvent();
    }, [paymentIntent?.id]);

    const handleUpdateMonetization = useCallback(() => {
        togglePaymentFormEvent();
    }, []);

    const handleCloseMobilePanel = (e: MouseEvent | TouchEvent) => {
        console.log('#Duy Phan console', e);
    };

    const toggleOutsideUserPanel = useCallback((e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        toggleUsersPanelEvent(false);
    }, []);

    const toggleOutsideSchedulePanel = useCallback(
        (e: MouseEvent | TouchEvent) => {
            e.stopPropagation();
            toggleSchedulePanelEvent(false);
        },
        [],
    );

    const toggleOutsidePaymentPanel = useCallback(
        (e: MouseEvent | TouchEvent) => {
            e.stopPropagation();
            togglePaymentFormEvent(false);
        },
        [],
    );

    const toggleOutsideBackgroundPanel = useCallback(
        (e: MouseEvent | TouchEvent) => {
            e.stopPropagation();
            toggleBackgroundManageEvent(false);
        },
        [],
    );

    const toggleRecordingUrlsList = useCallback(
        (e: MouseEvent | TouchEvent) => {
            e.stopPropagation();
            toggleRecordingUrlsListPanel(false);
        },
        [],
    );

    const handleCloseForm = useCallback(() => {
        togglePaymentFormEvent(false);
        if (!isOwner) {
            cancelPaymentIntentWithData();
        }
    }, [isOwner]);

    const handleRequestRecordingAccept = () => {
        startRecordMeeting({ url: fullUrl, byRequest: true, meetingId: meeting.id });
    };

    const handleRequestRecordingReject = () => {
        requestRecordingRejectEvent({ meetingId: meeting.id });
    };

    const handleLinkCopied = (videoId: string) => {
        getRecordingUrl({ meetingId: meeting.id, videoId });
        setIsCopyEnabled(true);
    };

    const commonContent = useMemo(
        () => (
            <>
                <ClickAwayListener onClickAway={toggleOutsideUserPanel}>
                    <Fade in={isUsersOpen}>
                        <CustomPaper
                            variant="black-glass"
                            className={clsx(styles.commonOpenPanel, {
                                [styles.mobile]: isMobile && isPortraitLayout,
                                [styles.landscape]:
                                    isMobile && !isPortraitLayout,
                            })}
                        >
                            <MeetingPeople />
                        </CustomPaper>
                    </Fade>
                </ClickAwayListener>
                <Fade in={isRecordingRequestReceived && !isAudience && !meetingRecordingStore.isRecordingStarted}>
                    <CustomPaper
                        variant="black-glass"
                        className={clsx(styles.recordingRequestList, {
                            [styles.mobile]: isMobile && isPortraitLayout,
                        })}
                    >
                        <CustomTypography variant="h4">
                            <Translation
                                nameSpace="meeting"
                                translation="recordingRequestTitle"
                            />
                        </CustomTypography>
                        <Divider light sx={{ margin: "24px 0px" }} />
                        <CustomScroll>
                            <CustomGrid
                                container
                                flexDirection="column"
                                alignItems="flex-start"
                                justifyContent="center"
                                gap={1}
                                marginBottom={3}
                            >
                                {
                                    meetingRecordingStore.requestUsers.map(user => (
                                        <CustomGrid
                                            key={user.id}
                                            item
                                            container
                                            justifyContent="flex-start"
                                            gap={1}
                                        >
                                            <ProfileAvatar
                                                className={styles.profileAvatar}
                                                src={
                                                    getAvatarUrlMeeting(user?.meetingAvatarId ?? '', list) ??
                                                    user?.profileAvatar
                                                }
                                                width="32px"
                                                height="32px"
                                                userName={user.username}
                                            />
                                            <CustomTypography key={user.id}>{user.username}</CustomTypography>
                                        </CustomGrid>
                                    ))
                                }
                            </CustomGrid>
                        </CustomScroll>
                        <CustomGrid
                            container
                            justifyContent="space-between"
                        >
                            {
                                recordingStartPending || meetingRecordingStore.isStartRecordingPending
                                    ? <CustomButton
                                        label={
                                            <CustomLoader />
                                        }
                                        size="small"
                                        className={styles.recordingRequestHandleBtn}
                                        disabled
                                        onClick={handleRequestRecordingAccept}
                                    />
                                    : <CustomButton
                                        label={
                                            <Translation
                                                nameSpace="meeting"
                                                translation="buttons.startRecording"
                                            />
                                        }
                                        size="small"
                                        className={styles.recordingRequestHandleBtn}
                                        onClick={handleRequestRecordingAccept}
                                    />
                            }

                            <CustomButton
                                variant="custom-cancel"
                                label={
                                    <Translation
                                        nameSpace="meeting"
                                        translation="buttons.reject"
                                    />
                                }
                                className={styles.recordingRequestHandleBtn}
                                onClick={handleRequestRecordingReject}
                            />
                        </CustomGrid>
                    </CustomPaper>
                </Fade>
                <ClickAwayListener onClickAway={toggleRecordingUrlsList}>
                    <Fade in={isRecordingUrlsListPanel}>
                        <CustomPaper
                            variant="black-glass"
                            className={clsx(styles.recordingRequestList, {
                                [styles.mobile]: isMobile && isPortraitLayout,
                            })}
                        >
                            <CustomTypography variant="h4">
                                <Translation
                                    nameSpace="meeting"
                                    translation="recordingUrlsListTitle"
                                />
                            </CustomTypography>
                            <Divider light sx={{ margin: "24px 0px" }} />
                            <CustomScroll className={styles.videosScroll}>
                                <CustomGrid
                                    container
                                    flexDirection="column"
                                    alignItems="flex-start"
                                    justifyContent="center"
                                    gap={1.5}
                                    marginBottom={3}
                                >
                                    {
                                        meetingRecordingStore.videos.length > 0
                                            ? meetingRecordingStore.videos.map((video: { id: string, endTime: string }) => (
                                                <CustomGrid
                                                    key={video.id}
                                                    item
                                                    container
                                                    justifyContent="space-between"
                                                >
                                                    <CustomTypography className={styles.urlTypography}>{formatText(video.endTime)}</CustomTypography>
                                                    <CopyToClipboard
                                                        text={meetingRecordingStore.urlForCopy}
                                                        onCopy={() => handleLinkCopied(video.id)}
                                                    >
                                                        <CustomTooltip
                                                            title="copy"
                                                            placement="right"
                                                        >
                                                            <ActionButton
                                                                variant="decline"
                                                                className={styles.copyBtn}
                                                                Icon={<CopyIcon width="15px" height="15px" />}
                                                            />
                                                        </CustomTooltip>
                                                    </CopyToClipboard>
                                                </CustomGrid>
                                            ))
                                            : <CustomTypography variant="body1">
                                                <Translation
                                                    nameSpace="meeting"
                                                    translation="noVideos"
                                                />
                                            </CustomTypography>
                                    }
                                </CustomGrid>
                            </CustomScroll>
                        </CustomPaper>
                    </Fade>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={toggleOutsideSchedulePanel}>
                    <Fade in={isScheduleOpen}>
                        <div className={styles.scheduleOpenPanelWrapper}>
                            <CustomPaper
                                variant="black-glass"
                                className={clsx(styles.scheduleOpenPanel, {
                                    [styles.mobile]: isMobile && isPortraitLayout,
                                })}
                            >
                                <CustomScroll>
                                    <MeetingInviteParticipants
                                        isParticipantPanelShow={isParticipantsPanelShow}
                                        handleParticipantPanel={setIsParticipantPanelShow}
                                    />
                                </CustomScroll>
                            </CustomPaper>
                            <CustomPaper
                                variant="black-glass"
                                className={clsx(styles.attendeesList, {
                                    [styles.mobile]: isMobile && isPortraitLayout,
                                })}
                            >
                                <CustomScroll>
                                    <MeetingAttendeesList isParticipantPanelShow={isParticipantsPanelShow} />
                                </CustomScroll>
                            </CustomPaper>
                        </div>
                    </Fade>
                </ClickAwayListener>
                <ConditionalRender condition={isMobile}>
                    <ClickAwayListener onClickAway={toggleOutsidePaymentPanel}>
                        <Fade in={isPaymentOpen}>
                            <CustomPaper
                                variant="black-glass"
                                className={clsx(styles.monetizationPanel, {
                                    [styles.mobile]:
                                        isMobile && isPortraitLayout,
                                    [styles.landscape]:
                                        isMobile && !isPortraitLayout,
                                })}
                            >
                                <ConditionalRender condition={isOwner}>
                                    <MeetingMonetization
                                        onUpdate={handleUpdateMonetization}
                                    />
                                </ConditionalRender>
                                <ConditionalRender
                                    condition={enabledPaymentMeetingParticipant}
                                >
                                    <PaymentForm
                                        onClose={handleCloseForm}
                                        payment={paymentMeetingParticipant}
                                    />
                                </ConditionalRender>
                                <ConditionalRender
                                    condition={enabledPaymentMeetingAudience}
                                >
                                    <PaymentForm
                                        onClose={handleCloseForm}
                                        payment={paymentMeetingAudience}
                                    />
                                </ConditionalRender>
                            </CustomPaper>
                        </Fade>
                    </ClickAwayListener>
                    <ClickAwayListener
                        onClickAway={toggleOutsideBackgroundPanel}
                    >
                        <Fade in={isChangeBackgroundOpen}>
                            <CustomPaper
                                variant="black-glass"
                                className={clsx(styles.commonOpenPanel, {
                                    [styles.mobile]:
                                        isMobile && isPortraitLayout,
                                    [styles.landscape]:
                                        isMobile && !isPortraitLayout,
                                })}
                            >
                                <MeetingChangeBackground />
                            </CustomPaper>
                        </Fade>
                    </ClickAwayListener>
                </ConditionalRender>
            </>
        ),
        [
            isOwner,
            isMobile,
            isUsersOpen,
            handleUpdateMonetization,
            handleClosePayment,
            handleCloseMobilePanel,
            isPaymentOpen,
            isScheduleOpen,
            isChangeBackgroundOpen,
        ],
    );

    const handleOpenSharingUsers = useCallback(() => {
        setIsSideUsersOpenEvent(true);
    }, []);

    const renderUserAvatar = useCallback(
        (user: MeetingUser) => (
            <ProfileAvatar
                key={user.id}
                className={styles.userAvatar}
                width="32px"
                height="32px"
                src={user?.profileAvatar}
                userName={user.username}
            />
        ),
        [],
    );

    return (
        <CustomGrid
            gap={1.5}
            container
            className={clsx(styles.panelWrapper, { [styles.mobile]: isMobile })}
        >
            <CustomPaper className={styles.controlPanelWrapper}>
                {!isMobile ? (
                    <> {commonContent}</>
                ) : (
                    <ConditionalRender
                        condition={
                            isUsersOpen ||
                            isScheduleOpen ||
                            isPaymentOpen ||
                            isChangeBackgroundOpen
                        }
                    >
                        <CustomGrid className={styles.mobilePanelsWrapper}>
                            <CustomScroll>
                                <CustomGrid
                                    onClick={handleCloseMobilePanel}
                                    className={styles.closeIcon}
                                >
                                    <CloseIcon width="40px" height="40px" />
                                </CustomGrid>
                                {commonContent}
                            </CustomScroll>
                        </CustomGrid>
                    </ConditionalRender>
                )}
            </CustomPaper>
            <ConditionalRender condition={isMobile && isScreenSharing}>
                <CustomPaper
                    variant="black-glass"
                    className={clsx(styles.mobileControlPanelWrapper)}
                >
                    <UsersAvatarsCounter<MeetingUser>
                        renderItem={renderUserAvatar}
                        onAction={handleOpenSharingUsers}
                        users={users}
                        withCounter
                    />
                </CustomPaper>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const MeetingControlPanel = memo(Component);
