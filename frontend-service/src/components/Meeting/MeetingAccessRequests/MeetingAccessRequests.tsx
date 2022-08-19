import React, { memo, useMemo } from 'react';
import { useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// components
import { MeetingUsersListItem } from '@components/Meeting/MeetingUsersList/MeetingUsersListItem';

// stores
import { $meetingUsersStore, sendAnswerAccessMeetingRequestEvent } from '../../../store';

// types
import { MeetingAccessStatuses, MeetingUser } from '../../../store/types';

// styles
import styles from './MeetingAccessRequests.module.scss';

const MeetingAccessRequests = memo(() => {
    const requestUsers = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state => state.filter(user => user.accessStatus === MeetingAccessStatuses.RequestSent),
    });

    const renderRequestUsers = useMemo(() => {
        const handleAcceptUser = ({ userId }: { userId: MeetingUser['id'] }) => {
            sendAnswerAccessMeetingRequestEvent({ isUserAccepted: true, userId });
        };

        const handleRejectUser = ({ userId }: { userId: MeetingUser['id'] }) => {
            sendAnswerAccessMeetingRequestEvent({ isUserAccepted: false, userId });
        };

        return requestUsers.map(user => (
            <MeetingUsersListItem
                key={user.id}
                onAcceptUser={handleAcceptUser}
                onDeleteUser={handleRejectUser}
                isAcceptRequest
                user={user}
            />
        ));
    }, [requestUsers]);

    return (
        <>
            {Boolean(requestUsers.length) && (
                <>
                    <CustomGrid
                        className={styles.usersWrapper}
                        container
                        direction="column"
                        gap={1}
                    >
                        {renderRequestUsers}
                    </CustomGrid>
                    <CustomDivider className={styles.divider} />
                </>
            )}
        </>
    );
});

export { MeetingAccessRequests };
