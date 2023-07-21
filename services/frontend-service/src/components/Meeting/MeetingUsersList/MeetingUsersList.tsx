import { memo, useCallback, useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// components
import { MeetingAccessStatusEnum } from 'shared-types';
import { MeetingUsersListItem } from './MeetingUsersListItem';

// stores
import { appDialogsApi } from '../../../store';
import {
    $isMeetingHostStore,
    $localUserStore,
    $meetingStore,
    $meetingUsersStore,
    changeHostSocketEvent,
    setUserToKickEvent,
} from '../../../store/roomStores';

// types
import { AppDialogsEnum, MeetingUser } from '../../../store/types';

// styles
import styles from './MeetingUsersList.module.scss';

const Component = () => {
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isMeetingHost = useStore($isMeetingHostStore);

    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user => user.accessStatus === MeetingAccessStatusEnum.InMeeting,
            ),
    });

    const handleKickUser = useCallback(({ userId }: {userId: string}) => {
        setUserToKickEvent(userId);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.userToKickDialog,
        });
    }, []);

    const handleChangeHost = useCallback(
        async ({ userId }: { userId: MeetingUser['id'] }) => {
            await changeHostSocketEvent({ userId });
        },
        [],
    );

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
        <CustomGrid
            className={styles.usersWrapper}
            container
            direction="column"
        >
            {renderUsersList}
        </CustomGrid>
    );
};

export const MeetingUsersList = memo(Component);
