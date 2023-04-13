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
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';

// components
import { MeetingMonetization } from '@components/Meeting/MeetingMonetization/MeetingMonetization';
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
    $isTogglePayment,
    $isToggleUsersPanel,
    $meetingTemplateStore,
    $meetingUsersStore,
    $paymentIntent,
    cancelPaymentIntentWithData,
    createPaymentIntentWithData,
    togglePaymentFormEvent,
} from '../../../store/roomStores';

// styles
import styles from './MeetingControlPanel.module.scss';

// types
import { MeetingUser } from '../../../store/types';

const Component = () => {
    const isOwner = useStore($isOwner);
    const isMeetingHost = useStore($isMeetingHostStore);
    const paymentIntent = useStore($paymentIntent);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isScreenSharing = useStore($isScreenSharingStore);
    const users = useStore($meetingUsersStore);
    const isPaymentOpen = useStore($isTogglePayment);
    const isUsersOpen = useStore($isToggleUsersPanel);

    useEffect(() => {
        (async () => {
            if (!meetingTemplate.isMonetizationEnabled && paymentIntent?.id) {
                cancelPaymentIntentWithData();
            }
        })();
    }, [meetingTemplate.isMonetizationEnabled]);

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

    const handleCloseMobilePanel = useCallback(() => {
        togglePaymentFormEvent();
    }, []);

    const commonContent = useMemo(
        () => (
            <>
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
            <CustomPaper
                variant="black-glass"
                className={styles.controlPanelWrapper}
            >
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
