import React, { memo, useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

import { MeetingUserVideoItem } from '@components/Meeting/MeetingUserVideoItem/MeetingUserVideoItem';

// stores
import { MeetingUserVideoPositionWrapper } from '@components/Meeting/MeetingUserVideoPositionWrapper/MeetingUserVideoPositionWrapper';
import { $localUserStore, $meetingUsersStore } from '../../../store/users';
import { $profileStore } from '../../../store/profile';

// types
import { MeetingAccessStatuses } from '../../../store/types';

import styles from './MeetingUsersVideos.module.scss';
import { $meetingStore } from '../../../store/meeting';

const MeetingUsersVideos = memo(() => {
    const localUser = useStore($localUserStore);
    const profile = useStore($profileStore);
    const meeting = useStore($meetingStore);

    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatuses.InMeeting &&
                    localUser.id !== user.id,
            ),
    });

    const renderUsers = useMemo(
        () =>
            users.map((user, index) => (
                <MeetingUserVideoPositionWrapper
                    key={user.id}
                    isScreensharing={Boolean(meeting.sharingUserId)}
                    elevationIndex={index}
                >
                    <MeetingUserVideoItem
                        size={meeting?.sharingUserId ? 56 : 120}
                        userName={user.username}
                        videoTrack={
                            meeting.sharingUserId !== user.meetingUserId
                                ? user.videoTrack
                                : undefined
                        }
                        audioTrack={user?.audioTrack!}
                        isCameraEnabled={user.cameraStatus === 'active'}
                        isMicEnabled={user.micStatus === 'active'}
                        userProfileAvatar={user.profileAvatar}
                        withoutName={Boolean(meeting?.sharingUserId)}
                        isScreensharingUser={meeting.sharingUserId === user.meetingUserId}
                    />
                </MeetingUserVideoPositionWrapper>
            )),
        [users, meeting.sharingUserId],
    );

    return (
        <CustomGrid className={styles.meetingVideos}>
            <MeetingUserVideoPositionWrapper
                isScreensharing={Boolean(meeting.sharingUserId)}
                elevationIndex={renderUsers.length}
            >
                <MeetingUserVideoItem
                    size={meeting?.sharingUserId ? 56 : 120}
                    userProfileAvatar={profile?.profileAvatar?.url}
                    userName={localUser.username}
                    videoTrack={localUser.videoTrack}
                    audioTrack={localUser.audioTrack}
                    isCameraEnabled={localUser.cameraStatus === 'active'}
                    isMicEnabled={localUser.micStatus === 'active'}
                    withoutName={Boolean(meeting?.sharingUserId)}
                    isScreensharingUser={localUser.meetingUserId === meeting?.sharingUserId}
                    isLocal
                />
            </MeetingUserVideoPositionWrapper>
            {renderUsers}
        </CustomGrid>
    );
});

export { MeetingUsersVideos };
