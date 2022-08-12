import React, { memo, useCallback, useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom components
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import { MeetingUsersListItem } from './MeetingUsersListItem';

// stores
import {
    $isOwner,
    $localUserStore,
    $meetingUsersStore,
    setUserToKickEvent,
    appDialogsApi,
} from '../../../store';

// types
import { MeetingAccessStatuses, AppDialogsEnum } from '../../../store/types';

// styles
import styles from './MeetingUsersList.module.scss';

const MeetingUsersList = memo(() => {
    const localUser = useStore($localUserStore);
    const isOwner = useStore($isOwner);

    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state => state.filter(user => user.accessStatus === MeetingAccessStatuses.InMeeting),
    });

    const handleKickUser = useCallback(({ userId }) => {
        setUserToKickEvent(userId);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.userToKickDialog,
        });
    }, []);

    const renderUsersList = useMemo(
        () =>
            users.map(user => (
                <MeetingUsersListItem
                    key={user.id}
                    user={user}
                    isLocalItem={localUser.id === user.id}
                    onDeleteUser={isOwner ? handleKickUser : undefined}
                />
            )),
        [users, localUser],
    );

    return (
        <CustomGrid className={styles.usersWrapper} container direction="column">
            {renderUsersList}
        </CustomGrid>
    );
});

export { MeetingUsersList };
