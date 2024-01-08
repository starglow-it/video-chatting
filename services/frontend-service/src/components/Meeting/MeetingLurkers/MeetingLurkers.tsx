import { useRef, useEffect } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import {
    $meetingStore,
    $meetingUsersStore,
    requestSwitchRoleByHostEvent,
} from 'src/store/roomStores';

import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

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
    const refScroll = useRef<any>(null);

    useEffect(() => {
        if (users) {
            if (refScroll.current)
                refScroll.current.scrollTop = refScroll.current?.scrollHeight;
        }
    }, [users]);

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
