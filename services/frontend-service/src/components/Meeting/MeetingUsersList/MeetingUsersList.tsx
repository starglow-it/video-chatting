import { memo, useCallback, useMemo, useRef, useEffect } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

// components
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
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
    setMoveUserToAudienceEvent
} from '../../../store/roomStores';

// types
import { AppDialogsEnum, MeetingUser } from '../../../store/types';

// styles
import styles from './MeetingUsersList.module.scss';

const Component = () => {
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isMeetingHost = useStore($isMeetingHostStore);
    const refScroll = useRef<any>(null);

    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole !== MeetingRole.Audience,
            ),
    });

    useEffect(() => {
        if (users) {
            if (refScroll.current)
                refScroll.current.scrollTop = refScroll.current?.scrollHeight;
        }
    }, [users]);

    const handleKickUser = useCallback(({ userId }: { userId: string }) => {
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

    const handleMoveToAudience = useCallback(
        ({ userId }: { userId: string }) => {
            setMoveUserToAudienceEvent(userId);
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.userToAudienceDialog,
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
                    isLocalItem={localUser.id === user.id}
                    isOwnerItem={meeting.owner === user.id}
                    onDeleteUser={isMeetingHost ? handleKickUser : undefined}
                    onChangeHost={isMeetingHost ? handleChangeHost : undefined}
                    onChangeRoleToAudience={isMeetingHost ? handleMoveToAudience : undefined}
                />
            )),
        [users, localUser, isMeetingHost, meeting.owner],
    );

    return (
        <CustomScroll
            className={styles.scroll}
            containerRef={(refS: any) => (refScroll.current = refS)}
        >
            <CustomGrid
                className={styles.usersWrapper}
                container
                direction="column"
            >
                {renderUsersList}
            </CustomGrid>
        </CustomScroll>
    );
};

export const MeetingUsersList = memo(Component);
