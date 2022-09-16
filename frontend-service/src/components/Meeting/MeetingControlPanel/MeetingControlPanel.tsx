import React, { memo, useCallback, useRef, useEffect, useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';
import { Fade } from '@mui/material';
import ClickAwayListener from '@mui/base/ClickAwayListener/ClickAwayListener';

// hooks
import { useMultipleToggle } from '@hooks/useMultipleToggle';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

// icons
import { PeoplesIcon } from '@library/icons/PeoplesIcon';
import { NotesIcon } from '@library/icons/NotesIcon';
import { MonetizationIcon } from '@library/icons/MonetizationIcon';
import { CloseIcon } from '@library/icons/CloseIcon';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { MeetingMonetization } from '@components/Meeting/MeetingMonetization/MeetingMonetization';
import { LeaveNoteForm } from '@components/LeaveNoteForm/LeaveNoteForm';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';
import { MeetingAccessRequests } from '@components/Meeting/MeetingAccessRequests/MeetingAccessRequests';
import { MeetingUsersList } from '@components/Meeting/MeetingUsersList/MeetingUsersList';
import { MeetingInviteParticipants } from '@components/Meeting/MeetingInviteParticipants/MeetingInviteParticipants';
import { UsersAvatarsCounter } from '@library/common/UsersAvatarsCounter/UsersAvatarsCounter';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// stores
import {
    $isOwner,
    $meetingUsersStore,
    $paymentIntent,
    $meetingTemplateStore,
    cancelPaymentIntentWithData,
    createPaymentIntentWithData,
    $profileStore,
    $isMeetingHostStore,
    $isScreensharingStore,
    setIsSideUsersOpenEvent,
} from '../../../store';

// styles
import styles from './MeetingControlPanel.module.scss';

// types
import { MeetingAccessStatuses, MeetingUser } from '../../../store/types';

const Component = () => {
    const isOwner = useStore($isOwner);
    const isMeetingHost = useStore($isMeetingHostStore);
    const paymentIntent = useStore($paymentIntent);
    const profile = useStore($profileStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isScreensharing = useStore($isScreensharingStore);
    const users = useStore($meetingUsersStore);

    const isCreatePaymentIntentPending = useStore(createPaymentIntentWithData.pending);

    const paperRef = useRef(null);

    const isThereNewRequests = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state => state.some(user => user.accessStatus === MeetingAccessStatuses.RequestSent),
    });

    const {
        values: { isUsersOpen, isLeaveNoteOpen, isPaymentOpen },
        onSwitchOff: handleSwitchOff,
        onSwitchToggle: handleSwitchToggle,
    } = useMultipleToggle(['isUsersOpen', 'isLeaveNoteOpen', 'isPaymentOpen']);

    useEffect(() => {
        (async () => {
            if (!meetingTemplate.isMonetizationEnabled) {
                handleSwitchOff();

                if (paymentIntent?.id) {
                    cancelPaymentIntentWithData();
                }
            }
        })();
    }, [meetingTemplate.isMonetizationEnabled]);

    const { isMobile } = useBrowserDetect();

    const handleToggleUsers = useCallback(() => {
        handleSwitchToggle('isUsersOpen');
    }, []);

    const handleToggleLeaveNote = useCallback(() => {
        handleSwitchToggle('isLeaveNoteOpen');
    }, []);

    const handleTogglePayment = useCallback(async () => {
        if (!isPaymentOpen && !paymentIntent?.id && !isOwner) {
            createPaymentIntentWithData();
        }

        if (paymentIntent?.id) {
            cancelPaymentIntentWithData();
        }

        handleSwitchToggle('isPaymentOpen');
    }, [isPaymentOpen, paymentIntent?.id, isOwner]);

    const handleClosePayment = useCallback(async () => {
        if (paymentIntent?.id) {
            cancelPaymentIntentWithData();
        }
        handleSwitchOff();
    }, [paymentIntent?.id]);

    const handleUpdateMonetization = useCallback(() => {
        handleSwitchOff();
    }, []);

    const handleCloseMobilePanel = useCallback(() => {
        handleSwitchOff();
    }, []);

    const iconSize = isMobile ? '22px' : '30px';

    const commonContent = useMemo(
        () => (
            <>
                <Fade in={isUsersOpen}>
                    <CustomPaper
                        variant="black-glass"
                        className={clsx(styles.commonOpenPanel, { [styles.mobile]: isMobile })}
                    >
                        <CustomScroll>
                            {isMeetingHost && <MeetingAccessRequests />}
                            <MeetingUsersList />
                            <MeetingInviteParticipants
                                onAction={isMobile ? handleCloseMobilePanel : undefined}
                            />
                        </CustomScroll>
                    </CustomPaper>
                </Fade>

                <ConditionalRender condition={!isMobile}>
                    <Fade in={isLeaveNoteOpen}>
                        <CustomPaper
                            variant="black-glass"
                            className={clsx(styles.commonOpenPanel, { [styles.mobile]: isMobile })}
                        >
                            <LeaveNoteForm onCancel={handleSwitchOff} />
                        </CustomPaper>
                    </Fade>
                </ConditionalRender>

                <Fade in={isPaymentOpen}>
                    <CustomPaper
                        variant="black-glass"
                        className={clsx(styles.commonOpenPanel, { [styles.mobile]: isMobile })}
                    >
                        <ConditionalRender condition={!isOwner}>
                            <PaymentForm onClose={handleClosePayment} />
                        </ConditionalRender>
                        <ConditionalRender condition={isOwner}>
                            <MeetingMonetization onUpdate={handleUpdateMonetization} />
                        </ConditionalRender>
                    </CustomPaper>
                </Fade>
            </>
        ),
        [
            isOwner,
            isLeaveNoteOpen,
            isMobile,
            isUsersOpen,
            handleUpdateMonetization,
            handleClosePayment,
            handleSwitchOff,
            handleCloseMobilePanel,
            isPaymentOpen,
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
            <ClickAwayListener onClickAway={handleClosePayment}>
                <CustomPaper
                    variant="black-glass"
                    ref={paperRef}
                    className={styles.controlPanelWrapper}
                >
                    <CustomGrid container gap={0.75}>
                        <ConditionalRender condition={!isMobile}>
                            <ActionButton
                                onAction={handleToggleLeaveNote}
                                className={clsx(styles.actionButton, styles.withAction, {
                                    [styles.active]: isLeaveNoteOpen,
                                    [styles.mobile]: isMobile,
                                })}
                                Icon={<NotesIcon width={iconSize} height={iconSize} />}
                            />
                        </ConditionalRender>

                        <ConditionalRender
                            condition={
                                isOwner
                                    ? Boolean(profile.isStripeEnabled && profile.stripeAccountId)
                                    : meetingTemplate.isMonetizationEnabled
                            }
                        >
                            <ActionButton
                                onAction={
                                    !isCreatePaymentIntentPending ? handleTogglePayment : undefined
                                }
                                className={clsx(styles.actionButton, styles.withAction, {
                                    [styles.active]: isPaymentOpen,
                                    [styles.mobile]: isMobile,
                                })}
                                Icon={<MonetizationIcon width={iconSize} height={iconSize} />}
                            />
                        </ConditionalRender>

                        <ActionButton
                            onAction={handleToggleUsers}
                            className={clsx(styles.actionButton, styles.withAction, {
                                [styles.active]: isUsersOpen,
                                [styles.newRequests]: isThereNewRequests && isMeetingHost,
                                [styles.mobile]: isMobile,
                            })}
                            Icon={<PeoplesIcon width={iconSize} height={iconSize} />}
                        />
                    </CustomGrid>
                    {!isMobile ? (
                        <CustomGrid className={styles.panelsWrapper}>{commonContent}</CustomGrid>
                    ) : (
                        <ConditionalRender
                            condition={isUsersOpen || isLeaveNoteOpen || isPaymentOpen}
                        >
                            <CustomGrid className={styles.mobilePanelsWrapper}>
                                <CustomScroll>
                                    <CloseIcon
                                        onClick={handleCloseMobilePanel}
                                        className={styles.closeIcon}
                                        width="40px"
                                        height="40px"
                                    />
                                    {commonContent}
                                </CustomScroll>
                            </CustomGrid>
                        </ConditionalRender>
                    )}
                </CustomPaper>
            </ClickAwayListener>
            <ConditionalRender condition={isMobile && isScreensharing}>
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
