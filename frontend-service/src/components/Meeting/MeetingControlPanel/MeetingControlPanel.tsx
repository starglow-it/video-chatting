import React, {memo, useCallback, useRef} from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import {Fade} from "@mui/material";

// helpers
import {useMultipleToggle} from "../../../hooks/useMultipleToggle";

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { PeoplesIcon } from '@library/icons/PeoplesIcon';
import { NotesIcon } from "@library/icons/NotesIcon";
import { ActionButton } from '@library/common/ActionButton/ActionButton';

// components
import { MeetingAccessRequests } from '@components/Meeting/MeetingAccessRequests/MeetingAccessRequests';
import { MeetingInviteParticipants } from '@components/Meeting/MeetingInviteParticipants/MeetingInviteParticipants';
import { MeetingUsersList } from '@components/Meeting/MeetingUsersList/MeetingUsersList';
import {LeaveNoteForm} from "@components/LeaveNoteForm/LeaveNoteForm";

// stores
import { $meetingStore } from '../../../store/meeting';
import { $localUserStore } from '../../../store/users';

// styles
import styles from './MeetingControlPanel.module.scss';

const MeetingControlPanel = memo(() => {
    const router = useRouter();
    const meeting = useStore($meetingStore);
    const user = useStore($localUserStore);

    const isEditTemplateView = router.pathname.includes('edit-template');

    const {
        values: { isUsersOpen, isLeaveNoteOpen },
        onSwitchOff: handleSwitchOff,
        onSwitchToggle: handleSwitchToggle
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

    const isOwner = meeting.ownerProfileId === user.profileId;

    return (
        <CustomPaper variant="black-glass" ref={paperRef} className={styles.controlPanelWrapper}>
            <CustomGrid container gap={0.75}>
                <ActionButton
                    onAction={isEditTemplateView ? undefined : handleToggleUsers}
                    className={clsx(styles.actionButton, {
                        [styles.withAction]: !isEditTemplateView,
                        [styles.active]: isUsersOpen,
                    })}
                    Icon={<PeoplesIcon width="30px" height="30px" />}
                />
                <ActionButton
                    onAction={isEditTemplateView ? undefined : handleToggleLeaveNote}
                    className={clsx(styles.actionButton, {
                        [styles.withAction]: !isEditTemplateView,
                        [styles.active]: isLeaveNoteOpen,
                    })}
                    Icon={<NotesIcon width="30px" height="30px" />}
                />
            </CustomGrid>
            {!isEditTemplateView && (
                <CustomGrid className={styles.panelsWrapper}>
                    <Fade in={isUsersOpen}>
                        <CustomPaper
                            variant="black-glass"
                            className={styles.commonOpenPanel}
                        >
                            {isOwner && <MeetingAccessRequests />}
                            <MeetingUsersList />
                            <MeetingInviteParticipants />
                        </CustomPaper>
                    </Fade>

                    <Fade in={isLeaveNoteOpen}>
                        <CustomPaper
                            variant="black-glass"
                            className={styles.commonOpenPanel}
                        >
                            <LeaveNoteForm onCancel={handleCloseLeaveNote} />
                        </CustomPaper>
                    </Fade>
                </CustomGrid>
            )}
        </CustomPaper>
    );
});

export { MeetingControlPanel };
