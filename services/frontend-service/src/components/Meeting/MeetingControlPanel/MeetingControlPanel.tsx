import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { Fade } from '@mui/material';
import { ClickAwayListener } from '@mui/base';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// components
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { MeetingInviteParticipants } from '@components/Meeting/MeetingInviteParticipants/MeetingInviteParticipants';
import { MeetingInviteParticipantsForMobile } from '@components/Meeting/MeetingInviteParticipantsForMobile/MeetingInviteParticipants';
import { MeetingAttendeesList } from '@components/Meeting/MeetingAttendeesList/MeetingAttendeesList';
import { MeetingAttendeesListForMobile } from '@components/Meeting/MeetingAttendeesListForMobile/MeetingAttendeesList';
import { UsersAvatarsCounter } from '@library/common/UsersAvatarsCounter/UsersAvatarsCounter';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { EmojiList } from '@components/EmojiList/EmojiList';
import { MoreListForMobile } from '../MoreListForMobile/MoreListForMobile';
import { MeetingChat } from '../MeetingChatForMobile/MeetingChat';
import { MeetingLinksForMobile } from '../MeetingLInksForMobile/MeetingLinksForMobile';
import { MeetingQuestionAnswer } from '../MeetingQuestionAnswerForMobile/MeetingQuestionAnswer';
import { MeetingNotesForMobile } from '../MeetingNotesForMobile/MeetingNotes';

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
    $isToggleUsersPanel,
    $meetingUsersStore,
    $paymentIntent,
    $paymentMeetingAudience,
    $paymentMeetingParticipant,
    $isTogglProfilePanel,
    $isToggleEditRuumePanel,
    $meetingEmojiListVisibilityStore,
    $isToggleEditRuumeSelectMenuOpenStore,
    $isPaymentCurrencyDropdownOpenStore,
    $isParticipant,
    $isAudience,
    $meetingPanelsVisibilityForMobileStore,
    $meetingDonationPanelForParticipantVisibilityStore,
    $meetingDonationPanelForAudienceVisibilityStore,
    initialMeetingPanelsVisibilityData,
    cancelPaymentIntentWithData,
    toggleBackgroundManageEvent,
    togglePaymentFormEvent,
    toggleSchedulePanelEvent,
    toggleProfilePanelEvent,
    setEmojiListVisibilityEvent,
    toggleEditRuumeSettingEvent,
    setMeetingPanelsVisibilityForMobileEvent,
    setDonationPanelForParticipantVisibilityEvent,
    setDonationPanelForAudienceVisibilityEvent
} from '../../../store/roomStores';

// styles
import styles from './MeetingControlPanel.module.scss';

// types
import { MeetingUser } from '../../../store/types';
import { MeetingPeople } from '../MeetingPeople/MeetingPeople';
import { MeetingProfileSetting } from '../MeetingProfileSetting/MeetingProfileSetting';
import { MeetingEditRuumeSetting } from '../MeetingEditRuumeSetting/MeetingEditRuumeSetting';
import { MeetingMonetization } from '../MeetingMonetization/MeetingMonetization';
import { MeetingChangeBackground } from '../MeetingChangeBackground/MeetingChangeBackground';
import Draggable from 'react-draggable';
import { MeetingEditRuumeSettingForMobile } from '../MeetingEditRuumeSettingForMobile/MeetingEditRuumeSetting';

const Component = () => {
    const isOwner = useStore($isOwner);
    const paymentIntent = useStore($paymentIntent);
    const isScreenSharing = useStore($isScreenSharingStore);
    const users = useStore($meetingUsersStore);
    const isPaymentOpen = useStore($isTogglePayment);
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isProfileOpen = useStore($isTogglProfilePanel);
    const isEditRuumeOpen = useStore($isToggleEditRuumePanel);
    const isPortraitLayout = useStore($isPortraitLayout);
    const isScheduleOpen = useStore($isToggleSchedulePanel);
    const isChangeBackgroundOpen = useStore($isToggleBackgroundPanel);
    const isToggleEditRuumeSelectMenuOpen = useStore($isToggleEditRuumeSelectMenuOpenStore);
    const enabledPaymentMeetingParticipant = useStore(
        $enabledPaymentMeetingParticipant,
    );
    const enabledPaymentMeetingAudience = useStore($enabledPaymentMeetingAudience);
    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);
    const paymentMeetingAudience = useStore($paymentMeetingAudience);
    const { isEmojiListVisible } = useStore($meetingEmojiListVisibilityStore);
    const [isParticipantsPanelShow, setIsParticipantPanelShow] = useState(true);
    const isParticipant = useStore($isParticipant);
    const isAudience = useStore($isAudience);
    const isPaymentCurrencyDropdownOpenStore = useStore($isPaymentCurrencyDropdownOpenStore);
    const { isDonationPanelForParticipantVisible } = useStore($meetingDonationPanelForParticipantVisibilityStore);
    const { isDonationPanelForAudienceVisible } = useStore($meetingDonationPanelForAudienceVisibilityStore);

    const {
        isMobileMoreListVisible,
        isMobileChatPanelVisible,
        isMobileAttendeeListVisible,
        isMobileLinksPanleVisible,
        isMobileQAPanleVisible,
        isMobileStickyNotesVisible,
        isMobileSettingPanelVisible,
        isMobileDonationPanleVisible
    } = useStore($meetingPanelsVisibilityForMobileStore);

    const { isMobile } = useBrowserDetect();

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

    const toggleProfilePanel = useCallback((e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        toggleProfilePanelEvent(false);
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

    const handleCloseEmojiListPanel = useCallback((e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        setEmojiListVisibilityEvent({ isEmojiListVisible: false })
    }, []);

    const handleCloseDonationPanelForParticipant = useCallback((e: MouseEvent | TouchEvent) => {
        if (enabledPaymentMeetingParticipant) {
            e.stopPropagation();
            if (isDonationPanelForParticipantVisible) {
                cancelPaymentIntentWithData();
            }
            setDonationPanelForParticipantVisibilityEvent({ isDonationPanelForParticipantVisible: false });
        }
    }, []);

    const handleCloseDonationPanelForAudience = useCallback((e: MouseEvent | TouchEvent) => {
        if (enabledPaymentMeetingAudience) {
            e.stopPropagation();

            if (isDonationPanelForAudienceVisible) {
                cancelPaymentIntentWithData();
            }
            setDonationPanelForAudienceVisibilityEvent({ isDonationPanelForAudienceVisible: false });
        }

    }, []);

    const handleCloseForm = useCallback(() => {
        togglePaymentFormEvent(false);
        if (!isOwner) {
            cancelPaymentIntentWithData();
            setDonationPanelForParticipantVisibilityEvent({ isDonationPanelForParticipantVisible: false });
            setDonationPanelForAudienceVisibilityEvent({ isDonationPanelForAudienceVisible: false });
        }
    }, [isOwner]);

    const handleCloseEditRuumePanel = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isPaymentCurrencyDropdownOpenStore) {
            e.stopPropagation();
            if (!isToggleEditRuumeSelectMenuOpen) {
                toggleEditRuumeSettingEvent(false);
            }
        }
    }, [isToggleEditRuumeSelectMenuOpen, isPaymentCurrencyDropdownOpenStore]);

    //For mobile
    const toggleMoreListForMobile = useCallback(
        (e: MouseEvent | TouchEvent) => {
            e.stopPropagation();
            if (isMobileMoreListVisible) {
                setMeetingPanelsVisibilityForMobileEvent({
                    ...initialMeetingPanelsVisibilityData,
                    isMobileMoreListVisible: false
                });
            }
        },
        [isMobileMoreListVisible],
    );

    const toggleDonationPanleForMobile = useCallback(
        (e: MouseEvent | TouchEvent) => {
            e.stopPropagation();
            if (isMobileDonationPanleVisible) {
                cancelPaymentIntentWithData();
                setMeetingPanelsVisibilityForMobileEvent({
                    ...initialMeetingPanelsVisibilityData,
                    isMobileDonationPanleVisible: false
                });
            }
        },
        [isMobileDonationPanleVisible],
    );

    const commonContent = useMemo(
        () => (
            <>
                <ClickAwayListener onClickAway={handleCloseDonationPanelForParticipant}>
                    <Fade in={isDonationPanelForParticipantVisible}>
                        <CustomPaper
                            variant="black-glass"
                            className={clsx(styles.donationPanel, {
                                [styles.isAudience]: isAudience,
                                [styles.mobile]: isMobile && isPortraitLayout,
                                [styles.landscape]:
                                    isMobile && !isPortraitLayout,
                            })}
                        >
                            <PaymentForm
                                isMobileForDonation={true}
                                onClose={handleCloseForm}
                                payment={paymentMeetingParticipant}
                            />
                        </CustomPaper>
                    </Fade>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={handleCloseDonationPanelForAudience}>
                    <Fade in={isDonationPanelForAudienceVisible}>
                        <CustomPaper
                            variant="black-glass"
                            className={clsx(styles.donationPanel, {
                                [styles.isAudience]: isAudience,
                                [styles.mobile]: isMobile && isPortraitLayout,
                                [styles.landscape]:
                                    isMobile && !isPortraitLayout,
                            })}
                        >
                            <PaymentForm
                                isMobileForDonation={true}
                                onClose={handleCloseForm}
                                payment={paymentMeetingAudience}
                            />
                        </CustomPaper>
                    </Fade>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={handleCloseEditRuumePanel}>
                    <Fade in={isEditRuumeOpen}>
                        <CustomPaper
                            variant="black-glass"
                            className={clsx(styles.editRuumePanel)}
                        >
                            <CustomScroll className={styles.editRuumeScrollBar}>
                                <MeetingEditRuumeSetting />
                            </CustomScroll>
                        </CustomPaper>
                    </Fade>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={toggleProfilePanel}>
                    <Fade in={isProfileOpen}>
                        <CustomPaper
                            variant="black-glass"
                            className={clsx(styles.profilePanel, {
                                [styles.mobile]: isMobile && isPortraitLayout,
                                [styles.landscape]:
                                    isMobile && !isPortraitLayout,
                            })}
                        >
                            <CustomScroll className={styles.profileSettingScrollBar}>
                                <MeetingProfileSetting />
                            </CustomScroll>
                        </CustomPaper>
                    </Fade>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={handleCloseEmojiListPanel}>
                    <Fade in={isEmojiListVisible}>
                        <CustomPaper
                            className={clsx(styles.emojiPanel, {
                                [styles.isParticipant]: isParticipant,
                                [styles.isAudience]: isAudience,
                                [styles.mobile]: isMobile,
                            })}
                            variant="black-glass"
                        >
                            <EmojiList />
                        </CustomPaper>
                    </Fade>
                </ClickAwayListener>
                <Fade in={isUsersOpen}>
                    <CustomBox
                        className={clsx(styles.notesPanel, {
                            [styles.isParticipant]: isParticipant,
                            [styles.isAudience]: isAudience,
                            [styles.mobile]: isMobile && isPortraitLayout,
                            [styles.landscape]:
                                isMobile && !isPortraitLayout,
                        })}
                    >
                        <Draggable
                            axis="both"
                            defaultPosition={{ x: 0, y: 0 }}
                        >
                            <CustomPaper
                                variant="black-glass">
                                <MeetingPeople />
                            </CustomPaper>
                        </Draggable>
                    </CustomBox>
                </Fade>
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
                    <ClickAwayListener onClickAway={toggleDonationPanleForMobile}>
                        <Fade in={isMobileDonationPanleVisible}>
                            <CustomPaper
                                variant="black-glass"
                                className={clsx(styles.monetizationPanel, {
                                    [styles.mobile]:
                                        isMobile && isPortraitLayout,
                                    [styles.landscape]:
                                        isMobile && !isPortraitLayout,
                                })}
                            >
                                <ConditionalRender
                                    condition={enabledPaymentMeetingParticipant}
                                >
                                    <PaymentForm
                                        isMobileForDonation={true}
                                        onClose={handleCloseForm}
                                        payment={paymentMeetingParticipant}
                                    />
                                </ConditionalRender>
                                <ConditionalRender
                                    condition={enabledPaymentMeetingAudience}
                                >
                                    <PaymentForm
                                        isMobileForDonation={true}
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
                    {/* reaction panel for mobile */}
                    <ClickAwayListener
                        onClickAway={toggleMoreListForMobile}
                    >
                        <Fade in={isMobileMoreListVisible}>
                            {/* <Fade in={true}> */}
                            <CustomPaper
                                className={styles.emojiPanelForMobile}
                                variant="black-glass"
                            >
                                <EmojiList />
                                <MoreListForMobile />
                            </CustomPaper>
                        </Fade>
                    </ClickAwayListener>
                    <Fade in={isMobileChatPanelVisible}>
                        {/* <Fade in={true}> */}
                        <CustomPaper
                            className={clsx(styles.chatPanelForMobile, { [styles.overlay]: isMobileChatPanelVisible })}
                            variant="black-glass"
                        >
                            <MeetingChat />
                        </CustomPaper>
                    </Fade>
                    <Fade in={isMobileLinksPanleVisible}>
                        {/* <Fade in={true}> */}
                        <CustomPaper
                            className={styles.chatPanelForMobile}
                            variant="black-glass"
                        >
                            <MeetingLinksForMobile />
                        </CustomPaper>
                    </Fade>
                    <Fade in={isMobileAttendeeListVisible}>
                        {/* <Fade in={true}> */}
                        <CustomBox
                            className={styles.attendeesListForMobile}
                        >
                            <MeetingInviteParticipantsForMobile />
                            <MeetingAttendeesListForMobile isParticipantPanelShow={isParticipantsPanelShow} />
                        </CustomBox>
                    </Fade>
                    <Fade in={isMobileQAPanleVisible}>
                        {/* <Fade in={true}> */}
                        <CustomPaper
                            className={styles.qaPanelForMobile}
                            variant="black-glass"
                        >
                            <MeetingQuestionAnswer />
                        </CustomPaper>
                    </Fade>
                    <Fade in={isMobileStickyNotesVisible}>
                        <CustomPaper
                            className={styles.qaPanelForMobile}
                            variant="black-glass"
                        >
                            <MeetingNotesForMobile />
                        </CustomPaper>
                    </Fade>
                    <Fade in={isMobileSettingPanelVisible}>
                        {/* <Fade in={true}> */}
                        <CustomPaper
                            className={styles.qaPanelForMobile}
                            variant="black-glass"
                        >
                            <MeetingEditRuumeSettingForMobile />
                        </CustomPaper>
                    </Fade>
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
            isEditRuumeOpen,
            isProfileOpen,
            isEmojiListVisible,
            isMobileMoreListVisible,
            isMobileChatPanelVisible,
            isMobileLinksPanleVisible,
            isMobileAttendeeListVisible,
            isMobileQAPanleVisible,
            isMobileStickyNotesVisible,
            isMobileSettingPanelVisible,
            isMobileDonationPanleVisible
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
            <ConditionalRender condition={!isMobile}>
                <CustomPaper className={styles.controlPanelWrapper}>
                    {commonContent}
                </CustomPaper>
            </ConditionalRender>
            <ConditionalRender condition={isMobile}>
                <CustomPaper className={clsx(styles.controlPanelWrapper, { [styles.mobile]: isMobile })}>
                    {commonContent}
                </CustomPaper>
            </ConditionalRender>
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
