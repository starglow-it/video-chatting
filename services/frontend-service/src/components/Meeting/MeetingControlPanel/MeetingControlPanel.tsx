import React, { memo, useCallback, useRef, useEffect, useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';
import { Fade } from '@mui/material';
import { ClickAwayListener } from '@mui/base';

// hooks
import { useMultipleToggle } from '@hooks/useMultipleToggle';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

// icons
import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';
import { NotesIcon } from 'shared-frontend/icons/OtherIcons/NotesIcon';
import { MonetizationIcon } from 'shared-frontend/icons/OtherIcons/MonetizationIcon';
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';

// components
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { MeetingMonetization } from '@components/Meeting/MeetingMonetization/MeetingMonetization';
import { LeaveNoteForm } from '@components/LeaveNoteForm/LeaveNoteForm';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { MeetingAccessRequests } from '@components/Meeting/MeetingAccessRequests/MeetingAccessRequests';
import { MeetingUsersList } from '@components/Meeting/MeetingUsersList/MeetingUsersList';
import { MeetingInviteParticipants } from '@components/Meeting/MeetingInviteParticipants/MeetingInviteParticipants';
import { UsersAvatarsCounter } from '@library/common/UsersAvatarsCounter/UsersAvatarsCounter';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// stores
import { MeetingAccessStatusEnum } from 'shared-types';
import { $profileStore, setIsSideUsersOpenEvent } from '../../../store';
import {
    $isMeetingHostStore,
    $isOwner,
    $isScreenSharingStore,
    $isToggleUsersPanel,
    $meetingTemplateStore,
    $meetingUsersStore,
    $paymentIntent,
    cancelPaymentIntentWithData,
    createPaymentIntentWithData,
    toggleUsersPanelEvent,
} from '../../../store/roomStores';

// styles
import styles from './MeetingControlPanel.module.scss';

// types
import { MeetingUser } from '../../../store/types';

const Component = () => {
    const isOwner = useStore($isOwner);
    const isMeetingHost = useStore($isMeetingHostStore);
    const paymentIntent = useStore($paymentIntent);
    const profile = useStore($profileStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isScreenSharing = useStore($isScreenSharingStore);
    const users = useStore($meetingUsersStore);

    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );

    const isUsersOpen = useStore($isToggleUsersPanel);
    const {
        values: { isPaymentOpen },
        onSwitchOff: handleSwitchOff,
        onSwitchToggle: handleSwitchToggle,
    } = useMultipleToggle(['isPaymentOpen']);

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

    const iconSize = isMobile ? '22px' : '22px';

    const commonContent = useMemo(
        () => (
            <>
                {/* <ClickAwayListener
                    onClickAway={() => toggleUsersPanelEvent(false)}
                > */}
                    <Fade in={isUsersOpen}>
                        <CustomPaper
                            variant="black-glass"
                            className={clsx(styles.commonOpenPanel, {
                                [styles.mobile]: isMobile,
                            })}
                        >
                            <CustomScroll>
                                {isMeetingHost && <MeetingAccessRequests />}
                                <MeetingUsersList />
                                <MeetingInviteParticipants
                                    onAction={
                                        isMobile
                                            ? handleCloseMobilePanel
                                            : undefined
                                    }
                                />
                            </CustomScroll>
                        </CustomPaper>
                    </Fade>
                {/* </ClickAwayListener> */}

                <Fade in={isPaymentOpen}>
                    <CustomPaper
                        variant="black-glass"
                        className={clsx(styles.commonOpenPanel, {
                            [styles.mobile]: isMobile,
                        })}
                    >
                        <ConditionalRender condition={!isOwner}>
                            <PaymentForm onClose={handleClosePayment} />
                        </ConditionalRender>
                        <ConditionalRender condition={isOwner}>
                            <MeetingMonetization
                                onUpdate={handleUpdateMonetization}
                            />
                        </ConditionalRender>
                    </CustomPaper>
                </Fade>
            </>
        ),
        [
            isOwner,
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
            {/* <ClickAwayListener onClickAway={handleClosePayment}> */}
            <CustomPaper
                variant="black-glass"
                className={styles.controlPanelWrapper}
            >
                {/* <CustomGrid container gap={0.75}>
                    <ConditionalRender
                        condition={
                            isOwner
                                ? Boolean(
                                      profile.isStripeEnabled &&
                                          profile.stripeAccountId,
                                  )
                                : meetingTemplate.isMonetizationEnabled
                        }
                    >
                        <ActionButton
                            onAction={
                                !isCreatePaymentIntentPending
                                    ? handleTogglePayment
                                    : undefined
                            }
                            className={clsx(
                                styles.actionButton,
                                styles.withAction,
                                {
                                    [styles.active]: isPaymentOpen,
                                    [styles.mobile]: isMobile,
                                },
                            )}
                            Icon={
                                <MonetizationIcon
                                    width={iconSize}
                                    height={iconSize}
                                />
                            }
                        />
                    </ConditionalRender>
                </CustomGrid> */}
                {!isMobile ? (
                    <CustomGrid className={styles.panelsWrapper}>
                        {commonContent}
                    </CustomGrid>
                ) : (
                    <ConditionalRender condition={isUsersOpen || isPaymentOpen}>
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
            {/* </ClickAwayListener> */}
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
