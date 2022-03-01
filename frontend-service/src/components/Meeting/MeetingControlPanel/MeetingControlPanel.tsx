import React, { memo, useCallback, useRef } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';

// helpers

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { PeoplesIcon } from '@library/icons/PeoplesIcon';
import { ActionButton } from '@library/common/ActionButton/ActionButton';

// components
import { MeetingAccessRequests } from '@components/Meeting/MeetingAccessRequests/MeetingAccessRequests';
import { MeetingInviteParticipants } from '@components/Meeting/MeetingInviteParticipants/MeetingInviteParticipants';
import { MeetingUsersList } from '@components/Meeting/MeetingUsersList/MeetingUsersList';
import { useToggle } from '../../../hooks/useToggle';

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

    const { value: usersOpen, onToggleSwitch: handleToggleUsers } = useToggle(false);

    const paperRef = useRef(null);

    const isOwner = meeting.ownerProfileId === user.profileId;

    const handleOpenUsers = useCallback(() => {
        handleToggleUsers();
    }, []);

    return (
        <CustomPaper variant="black-glass" ref={paperRef} className={styles.controlPanelWrapper}>
            <ActionButton
                onAction={isEditTemplateView ? undefined : handleOpenUsers}
                className={clsx(styles.actionButton, {
                    [styles.withAction]: !isEditTemplateView,
                    [styles.active]: usersOpen,
                })}
                Icon={<PeoplesIcon width="30px" height="30px" />}
            />
            {!isEditTemplateView && (
                <CustomGrid className={styles.panelsWrapper}>
                    <CustomPaper
                        variant="black-glass"
                        className={clsx(styles.commonOpenPanel, { [styles.open]: usersOpen })}
                    >
                        {isOwner && <MeetingAccessRequests />}
                        <MeetingUsersList />
                        <MeetingInviteParticipants />
                    </CustomPaper>
                </CustomGrid>
            )}
        </CustomPaper>
    );
});

export { MeetingControlPanel };
