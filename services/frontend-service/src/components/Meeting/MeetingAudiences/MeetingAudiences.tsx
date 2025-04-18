import { useRef, useEffect } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingAccessStatusEnum, MeetingRole } from 'shared-types';
import {
    $isMeetingHostStore,
    $meetingStore,
    $meetingUsersStore,
    setUserToKickEvent,
    requestSwitchRoleByHostEvent,
} from 'src/store/roomStores';

import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

import { useCallback, useMemo } from 'react';
import styles from './MeetingAudience.module.scss';
import { MeetingUsersListItem } from '../MeetingUsersList/MeetingUsersListItem';
import Typography from '@mui/material/Typography';

import { appDialogsApi } from '../../../store';
import { AppDialogsEnum } from '../../../store/types';

export const MeetingAudiences = () => {
    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    user.meetingRole === MeetingRole.Audience,
            ),
    });
    const meeting = useStore($meetingStore);
    const isMeetingHost = useStore($isMeetingHostStore);
    const refScroll = useRef<any>(null);

    useEffect(() => {
        if (users) {
            if (refScroll.current)
                refScroll.current.scrollTop = refScroll.current?.scrollHeight;
        }
    }, [users]);

    const handleRequestAudience = useCallback(
        ({ userId }: { userId: string }) => {
            requestSwitchRoleByHostEvent({
                meetingId: meeting.id,
                meetingUserId: userId,
            });
        },
        [],
    );

    const handleKickUser = useCallback(({ userId }: { userId: string }) => {
        setUserToKickEvent(userId);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.userToKickDialog,
        });
    }, []);

    const renderUsersList = useMemo(
        () =>
            {
                if (users.length) {
                    return users.map(user => (
                        <MeetingUsersListItem
                            key={user.id}
                            user={user}
                            isLocalItem={false}
                            isOwnerItem={false}
                            isAudience={user.meetingRole === MeetingRole.Audience}
                            onDeleteUser={isMeetingHost ? handleKickUser : undefined}
                            isAudienceRequest
                            onRequestAudience={handleRequestAudience}
                        />
                    ));
                } else {
                    return <Typography varient="body1" className={styles.noAudience}>No audience...</Typography>
                }
            },
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
