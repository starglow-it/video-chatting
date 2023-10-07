import { useStore, useStoreMap } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import {
    $meetingStore,
    $meetingUsersStore,
    requestSwitchRoleByHostEvent,
} from 'src/store/roomStores';

import { useCallback, useMemo } from 'react';
import styles from './MeetingLurker.module.scss';
import { MeetingUsersListItem } from '../MeetingUsersList/MeetingUsersListItem';

export const MeetingLurkers = () => {
    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole === MeetingRole.Lurker,
            ),
    });
    const meeting = useStore($meetingStore);

    const handleRequestLurker = useCallback(
        ({ userId }: { userId: string }) => {
            requestSwitchRoleByHostEvent({
                meetingId: meeting.id,
                meetingUserId: userId,
            });
        },
        [],
    );

    const renderUsersList = useMemo(
        () =>
            users.map(user => (
                <MeetingUsersListItem
                    key={user.id}
                    user={user}
                    isLocalItem={false}
                    isOwnerItem={false}
                    isLurkerRequest
                    onRequestLurker={handleRequestLurker}
                />
            )),
        [users],
    );

    return (
        <CustomGrid
            className={styles.usersWrapper}
            container
            direction="column"
        >
            {renderUsersList}
        </CustomGrid>
    );
};
