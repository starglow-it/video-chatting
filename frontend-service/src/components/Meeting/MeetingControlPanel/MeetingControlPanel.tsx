import React, { memo, useCallback, useRef } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';
import { Fade } from '@mui/material';

// helpers

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { PeoplesIcon } from '@library/icons/PeoplesIcon';
import { NotesIcon } from '@library/icons/NotesIcon';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { MeetingAccessRequests } from '@components/Meeting/MeetingAccessRequests/MeetingAccessRequests';
import { MeetingInviteParticipants } from '@components/Meeting/MeetingInviteParticipants/MeetingInviteParticipants';
import { MeetingUsersList } from '@components/Meeting/MeetingUsersList/MeetingUsersList';
import { LeaveNoteForm } from '@components/LeaveNoteForm/LeaveNoteForm';
import { useMultipleToggle } from '../../../hooks/useMultipleToggle';

// stores
import { $isOwner } from '../../../store/meeting';
import { $meetingUsersStore } from '../../../store/users';

// styles
import styles from './MeetingControlPanel.module.scss';

// types
import { MeetingAccessStatuses } from '../../../store/types';

const MeetingControlPanel = memo(() => {
    const isOwner = useStore($isOwner);

    const isThereNewRequests = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state => state.some(user => user.accessStatus === MeetingAccessStatuses.RequestSent),
    });

    const {
        values: { isUsersOpen, isLeaveNoteOpen },
        onSwitchOff: handleSwitchOff,
        onSwitchToggle: handleSwitchToggle,
    } = useMultipleToggle(['isUsersOpen', 'isLeaveNoteOpen']);

    const handleToggleUsers = useCallback(() => {
        handleSwitchToggle('isUsersOpen');
    }, []);

    const handleToggleLeaveNote = useCallback(() => {
        handleSwitchToggle('isLeaveNoteOpen');
    }, []);

    const handleCloseLeaveNote = useCallback(() => {
        handleSwitchOff();
    }, []);

    const paperRef = useRef(null);

    return (
        <CustomPaper variant="black-glass" ref={paperRef} className={styles.controlPanelWrapper}>
            <CustomGrid container gap={0.75}>
                <ActionButton
                    onAction={handleToggleLeaveNote}
                    className={clsx(styles.actionButton, styles.withAction, {
                        [styles.active]: isLeaveNoteOpen,
                    })}
                    Icon={<NotesIcon width="30px" height="30px" />}
                />
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
                        <LeaveNoteForm onCancel={handleCloseLeaveNote} />
                    </CustomPaper>
                </Fade>
            </CustomGrid>
        </CustomPaper>
    );
});

export { MeetingControlPanel };
