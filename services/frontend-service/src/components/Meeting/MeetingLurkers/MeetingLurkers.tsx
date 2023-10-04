import { useStoreMap } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import { $meetingUsersStore } from 'src/store/roomStores';

import { useMemo } from 'react';
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

    const renderUsersList = useMemo(
        () =>
            users.map(user => (
                <MeetingUsersListItem
                    key={user.id}
                    user={user}
                    isLocalItem={false}
                    isOwnerItem={false}
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
