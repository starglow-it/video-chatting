import React, { memo, useCallback, useRef, useEffect } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';
import { Fade } from '@mui/material';
import ClickAwayListener from '@mui/base/ClickAwayListener/ClickAwayListener';

// hooks
import { useMultipleToggle } from '@hooks/useMultipleToggle';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// icons
import { PeoplesIcon } from '@library/icons/PeoplesIcon';
import { NotesIcon } from '@library/icons/NotesIcon';
import { MonetizationIcon } from '@library/icons/MonetizationIcon';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { MeetingAccessRequests } from '@components/Meeting/MeetingAccessRequests/MeetingAccessRequests';
import { MeetingInviteParticipants } from '@components/Meeting/MeetingInviteParticipants/MeetingInviteParticipants';
import { MeetingMonetization } from '@components/Meeting/MeetingMonetization/MeetingMonetization';
import { MeetingUsersList } from '@components/Meeting/MeetingUsersList/MeetingUsersList';
import { LeaveNoteForm } from '@components/LeaveNoteForm/LeaveNoteForm';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';

// stores
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';
import {
    $isOwner,
    $meetingUsersStore,
    $paymentIntent,
    $meetingTemplateStore,
    cancelPaymentIntentWithData,
    createPaymentIntentWithData,
    $profileStore,
} from '../../../store';

// styles
import styles from './MeetingControlPanel.module.scss';

// types
import { MeetingAccessStatuses } from '../../../store/types';

const MeetingControlPanel = memo(() => {
    const isOwner = useStore($isOwner);
    const paymentIntent = useStore($paymentIntent);
    const profile = useStore($profileStore);
    const meetingTemplate = useStore($meetingTemplateStore);
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
        if (!meetingTemplate.isMonetizationEnabled) {
            handleSwitchOff();

            if (paymentIntent?.id) {
                cancelPaymentIntentWithData();
            }
        }
    }, [meetingTemplate.isMonetizationEnabled]);

    const handleToggleUsers = useCallback(() => {
        handleSwitchToggle('isUsersOpen');
    }, []);

    const handleToggleLeaveNote = useCallback(() => {
        handleSwitchToggle('isLeaveNoteOpen');
    }, []);

    const handleTogglePayment = useCallback(() => {
        if (!isPaymentOpen && !paymentIntent?.id && !isOwner) {
            createPaymentIntentWithData();
        }

        if (paymentIntent?.id) cancelPaymentIntentWithData();

        handleSwitchToggle('isPaymentOpen');
    }, [isPaymentOpen, paymentIntent?.id, isOwner]);

    const handleClosePayment = useCallback(() => {
        if (paymentIntent?.id) cancelPaymentIntentWithData();
        handleSwitchOff();
    }, [paymentIntent?.id]);

    return (
        <ClickAwayListener onClickAway={handleClosePayment}>
            <CustomPaper
                variant="black-glass"
                ref={paperRef}
                className={styles.controlPanelWrapper}
            >
                <CustomGrid container gap={0.75}>
                    <ActionButton
                        onAction={handleToggleLeaveNote}
                        className={clsx(styles.actionButton, styles.withAction, {
                            [styles.active]: isLeaveNoteOpen,
                        })}
                        Icon={<NotesIcon width="30px" height="30px" />}
                    />
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
                            })}
                            Icon={<MonetizationIcon width="30px" height="30px" />}
                        />
                    </ConditionalRender>

                    <ActionButton
                        onAction={handleToggleUsers}
                        className={clsx(styles.actionButton, styles.withAction, {
                            [styles.active]: isUsersOpen,
                            [styles.newRequests]: isThereNewRequests && isOwner,
                        })}
                        Icon={<PeoplesIcon width="30px" height="30px" />}
                    />
                </CustomGrid>
                <CustomGrid className={styles.panelsWrapper}>
                    <Fade in={isUsersOpen}>
                        <CustomPaper variant="black-glass" className={styles.commonOpenPanel}>
                            {isOwner && <MeetingAccessRequests />}
                            <MeetingUsersList />
                            <MeetingInviteParticipants />
                        </CustomPaper>
                    </Fade>

                    <Fade in={isLeaveNoteOpen}>
                        <CustomPaper variant="black-glass" className={styles.commonOpenPanel}>
                            <LeaveNoteForm onCancel={handleSwitchOff} />
                        </CustomPaper>
                    </Fade>

                    <Fade in={isPaymentOpen}>
                        <CustomPaper variant="black-glass" className={styles.commonOpenPanel}>
                            <ConditionalRender condition={!isOwner}>
                                <PaymentForm onClose={handleClosePayment} />
                            </ConditionalRender>
                            <ConditionalRender condition={isOwner}>
                                <MeetingMonetization />
                            </ConditionalRender>
                        </CustomPaper>
                    </Fade>
                </CustomGrid>
            </CustomPaper>
        </ClickAwayListener>
    );
});

export { MeetingControlPanel };
