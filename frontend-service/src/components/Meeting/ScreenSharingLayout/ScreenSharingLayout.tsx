import React, { memo } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { ScreenSharingVideo } from '@components/Meeting/ScreenSharingVideo/ScreenSharingVideo';
import { ScreenSharingPlaceholder } from '@components/Meeting/ScreenSharingPlaceholder/ScreenSharingPlaceholder';

// stores
import { $meetingStore } from '../../../store';
import { $localUserStore, $meetingUsersStore } from '../../../store';

// types
import { Meeting, MeetingUser } from '../../../store/types';

// styles
import styles from './ScreenSharingLayout.module.scss';

const ScreenSharingLayout = memo(() => {
    const meeting = useStore($meetingStore);
    const localUser = useStore($localUserStore);

    const isLocalUserScreenSharing = localUser.meetingUserId === meeting.sharingUserId;

    const screenSharingUser = useStoreMap<
        MeetingUser[],
        MeetingUser | null,
        [Meeting['sharingUserId']]
    >({
        store: $meetingUsersStore,
        keys: [meeting.sharingUserId],
        fn: (state, [sharingUserId]) =>
            state.find(user => user.meetingUserId === sharingUserId) || null,
    });

    return (
        <CustomGrid container className={styles.screenSharingLayoutWrapper}>
            {isLocalUserScreenSharing ? (
                <ScreenSharingPlaceholder />
            ) : (
                <ScreenSharingVideo
                    videoTrack={
                        isLocalUserScreenSharing ? localUser.videoTrack : screenSharingUser?.videoTrack
                    }
                />
            )}

        </CustomGrid>
    );
});

export { ScreenSharingLayout };
