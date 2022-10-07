import React, { memo } from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { ScreenSharingVideo } from '@components/Meeting/ScreenSharingVideo/ScreenSharingVideo';
import { ScreenSharingPlaceholder } from '@components/Meeting/ScreenSharingPlaceholder/ScreenSharingPlaceholder';

// stores
import { $localUserStore, $meetingStore, $tracksStore } from '../../../store/roomStores';

// types
import { ConnectionType, StreamType } from '../../../const/webrtc';

// styles
import styles from './ScreenSharingLayout.module.scss';
import { getConnectionKey } from '../../../helpers/media/getConnectionKey';

// utils

const Component = () => {
    const meeting = useStore($meetingStore);
    const localUser = useStore($localUserStore);

    const isLocalUserScreenSharing = localUser.id === meeting.sharingUserId;

    const sharingTracks = useStoreMap({
        store: $tracksStore,
        keys: [
            getConnectionKey({
                userId: meeting.sharingUserId || '',
                streamType: StreamType.SCREEN_SHARING,
                connectionType: ConnectionType.VIEW,
            }),
        ],
        fn: (tracks, [connectionId]) => tracks[connectionId],
    });

    return (
        <CustomGrid container className={styles.screenSharingLayoutWrapper}>
            {isLocalUserScreenSharing ? (
                <ScreenSharingPlaceholder />
            ) : (
                <ScreenSharingVideo videoTrack={sharingTracks?.videoTrack} />
            )}
        </CustomGrid>
    );
};

export const ScreenSharingLayout = memo(Component);
