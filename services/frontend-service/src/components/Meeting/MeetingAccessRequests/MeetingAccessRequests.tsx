import { memo, useMemo } from 'react';
import { useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';

// components
import { MeetingUsersListItem } from '@components/Meeting/MeetingUsersList/MeetingUsersListItem';

// stores
import {
    AnswerSwitchRoleAction,
    MeetingAccessStatusEnum,
    MeetingRole,
} from 'shared-types';
import {
    $meetingUsersStore,
    sendAnswerAccessMeetingRequestEvent,
    sendAnswerRequestByHostEvent,
} from '../../../store/roomStores';

// types
import { MeetingUser } from '../../../store/types';

// styles
import styles from './MeetingAccessRequests.module.scss';

const Component = () => {
    const requestUsers = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.RequestSent ||
                    user.accessStatus ===
                        MeetingAccessStatusEnum.SwitchRoleSent,
            ),
    });

    const renderRequestUsers = useMemo(() => {
        const handleAcceptUser = ({
            userId,
        }: {
            userId: MeetingUser['id'];
        }) => {
            const user = requestUsers.find(item => item.id === userId);
            if (user?.meetingRole === MeetingRole.Participant) {
                sendAnswerAccessMeetingRequestEvent({
                    isUserAccepted: true,
                    userId,
                });
            } else {
                sendAnswerRequestByHostEvent({
                    action: AnswerSwitchRoleAction.Accept,
                    userId,
                });
            }
        };

        const handleRejectUser = ({
            userId,
        }: {
            userId: MeetingUser['id'];
        }) => {
            const user = requestUsers.find(item => item.id === userId);
            if (user?.meetingRole === MeetingRole.Participant) {
                sendAnswerAccessMeetingRequestEvent({
                    isUserAccepted: false,
                    userId,
                });
            } else {
                sendAnswerRequestByHostEvent({
                    action: AnswerSwitchRoleAction.Rejected,
                    userId,
                });
            }
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

    if (requestUsers.length) {
        return (
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
        );
    }

    return null;
};

export const MeetingAccessRequests = memo(Component);
