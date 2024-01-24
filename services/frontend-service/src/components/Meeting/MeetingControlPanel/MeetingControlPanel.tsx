import { memo, useCallback, useMemo, useState } from 'react';
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
    $isToggleUsersPanel,
    $meetingUsersStore,
    $paymentIntent,
    $paymentMeetingAudience,
    $paymentMeetingParticipant,
    cancelPaymentIntentWithData,
    toggleBackgroundManageEvent,
    togglePaymentFormEvent,
    toggleSchedulePanelEvent,
    toggleUsersPanelEvent,
} from '../../../store/roomStores';

// styles
import styles from './MeetingControlPanel.module.scss';

// types
import { MeetingUser } from '../../../store/types';
import { MeetingPeople } from '../MeetingPeople/MeetingPeople';
import { MeetingMonetization } from '../MeetingMonetization/MeetingMonetization';
import { MeetingChangeBackground } from '../MeetingChangeBackground/MeetingChangeBackground';

const Component = () => {
    const isOwner = useStore($isOwner);
    const paymentIntent = useStore($paymentIntent);
    const isScreenSharing = useStore($isScreenSharingStore);
    const users = useStore($meetingUsersStore);
    const isPaymentOpen = useStore($isTogglePayment);
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isPortraitLayout = useStore($isPortraitLayout);
    const isScheduleOpen = useStore($isToggleSchedulePanel);
    const isChangeBackgroundOpen = useStore($isToggleBackgroundPanel);
    const enabledPaymentMeetingParticipant = useStore(
        $enabledPaymentMeetingParticipant,
    );
    const enabledPaymentMeetingAudience = useStore($enabledPaymentMeetingAudience);
    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);
    const paymentMeetingAudience = useStore($paymentMeetingAudience);

    const [isParticipantsPanelShow, setIsParticipantPanelShow] = useState(true);

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

    const handleCloseForm = useCallback(() => {
        togglePaymentFormEvent(false);
        if (!isOwner) {
            cancelPaymentIntentWithData();
        }
    }, [isOwner]);

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
