import React, { memo, useCallback, useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { MeetingUsersListItem } from './MeetingUsersListItem';

// stores
import {
    $localUserStore,
    $meetingUsersStore,
    setUserToKickEvent,
    appDialogsApi,
    changeHostSocketEvent,
    $isMeetingHostStore,
    $meetingStore,
} from '../../../store';

// types
import { MeetingAccessStatuses, AppDialogsEnum } from '../../../store/types';

// styles
import styles from './MeetingUsersList.module.scss';

const MeetingUsersList = memo(() => {
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isMeetingHost = useStore($isMeetingHostStore);

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

    const handleChangeHost = useCallback(({ userId }) => {
        changeHostSocketEvent({ userId });
    }, []);

    const renderUsersList = useMemo(
        () =>
            users.map(user => (
                <MeetingUsersListItem
                    key={user.id}
                    user={user}
                    isLocalItem={localUser.id === user.id}
                    isOwnerItem={meeting.owner === user.id}
                    onDeleteUser={isMeetingHost ? handleKickUser : undefined}
                    onChangeHost={isMeetingHost ? handleChangeHost : undefined}
                />
            )),
        [users, localUser, isMeetingHost, meeting.owner],
    );

    return (
        <CustomGrid className={styles.usersWrapper} container direction="column">
            {renderUsersList}
        </CustomGrid>
    );
});

export { MeetingUsersList };
