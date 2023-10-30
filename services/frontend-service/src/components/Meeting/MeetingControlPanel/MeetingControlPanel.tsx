import { memo, useCallback, useMemo } from 'react';
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
import { UsersAvatarsCounter } from '@library/common/UsersAvatarsCounter/UsersAvatarsCounter';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// stores
import { $isPortraitLayout, setIsSideUsersOpenEvent } from '../../../store';
import {
    $isOwner,
    $isScreenSharingStore,
    $isTogglePayment,
    $isToggleSchedulePanel,
    $isToggleUsersPanel,
    $meetingUsersStore,
    $paymentIntent,
    cancelPaymentIntentWithData,
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

const Component = () => {
    const isOwner = useStore($isOwner);
    const paymentIntent = useStore($paymentIntent);
    const isScreenSharing = useStore($isScreenSharingStore);
    const users = useStore($meetingUsersStore);
    const isPaymentOpen = useStore($isTogglePayment);
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isPortraitLayout = useStore($isPortraitLayout);
    const isScheduleOpen = useStore($isToggleSchedulePanel);

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

    const handleCloseMobilePanel = () => {
        toggleUsersPanelEvent();
    };

    const toggleOutsideUserPanel = (e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        toggleUsersPanelEvent(false);
    };

    const toggleOutsideSchedulePanel = (e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        toggleSchedulePanelEvent(false);
    };

    const toggleOutsidePaymentPanel = (e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        togglePaymentFormEvent(false);
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
                            })}
                        >
                            <MeetingPeople />
                        </CustomPaper>
                    </Fade>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={toggleOutsideSchedulePanel}>
                    <Fade in={isScheduleOpen}>
                        <CustomPaper
                            variant="black-glass"
                            className={clsx(styles.scheduleOpenPanel, {
                                [styles.mobile]: isMobile && isPortraitLayout,
                            })}
                        >
                            <CustomScroll>
                                <MeetingInviteParticipants />
                            </CustomScroll>
                        </CustomPaper>
                    </Fade>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={toggleOutsidePaymentPanel}>
                    <Fade in={isPaymentOpen}>
                        <CustomPaper
                            variant="black-glass"
                            className={clsx(styles.commonOpenPanel, {
                                [styles.mobile]: isMobile && isPortraitLayout,
                            })}
                        >
                            <CustomGrid>
                                <MeetingMonetization
                                    onUpdate={handleUpdateMonetization}
                                />
                            </CustomGrid>
                        </CustomPaper>
                    </Fade>
                </ClickAwayListener>
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
                            isUsersOpen || isScheduleOpen || isPaymentOpen
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
