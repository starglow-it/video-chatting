import React, {memo, useMemo} from 'react';
import { useStore, useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { MeetingUserVideoItem } from '@components/Meeting/MeetingUserVideoItem/MeetingUserVideoItem';
import { MeetingUserVideoPositionWrapper } from '@components/Meeting/MeetingUserVideoPositionWrapper/MeetingUserVideoPositionWrapper';

// stores
import { $localUserStore, $meetingUsersStore } from '../../../store/users';
import { $profileStore } from '../../../store/profile';
import { $meetingStore, $meetingTemplateStore } from '../../../store/meeting';

// types
import { MeetingAccessStatuses } from '../../../store/types';

// styles
import styles from './MeetingUsersVideos.module.scss';

const MeetingUsersVideos = memo(() => {
    const localUser = useStore($localUserStore);
    const profile = useStore($profileStore);
    const meeting = useStore($meetingStore);
    const meetingTemplate = useStore($meetingTemplateStore);

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

    const isScreenSharing = Boolean(meeting.sharingUserId);

    const renderUsers = useMemo(
        () =>
            users.map((user, index) => (
                <MeetingUserVideoPositionWrapper
                    key={user.id}
                    elevationIndex={index + 1}
                    isScreensharing={isScreenSharing}
                    top={meetingTemplate?.usersPosition?.[index + 1]?.top}
                    left={meetingTemplate?.usersPosition?.[index + 1]?.left}
                >
                    <MeetingUserVideoItem
                        size={isScreenSharing ? 56 : 120}
                        userName={user.username}
                        videoTrack={
                            meeting.sharingUserId !== user.meetingUserId
                                ? user.videoTrack
                                : undefined
                        }
                        audioTrack={user?.audioTrack}
                        isCameraEnabled={user.cameraStatus === 'active'}
                        isMicEnabled={user.micStatus === 'active'}
                        userProfileAvatar={user.profileAvatar}
                        withoutName={isScreenSharing}
                        isAuraActive={user.isAuraActive}
                        isScreensharingUser={meeting.sharingUserId === user.meetingUserId}
                    />
                </MeetingUserVideoPositionWrapper>
            )),
        [users, meeting.sharingUserId, meetingTemplate.usersPosition],
    );

    return (
        <CustomGrid className={styles.meetingVideos}>
            <MeetingUserVideoPositionWrapper
                elevationIndex={0}
                key={localUser.id}
                isScreensharing={Boolean(meeting.sharingUserId)}
                top={meetingTemplate?.usersPosition?.[0].top}
                left={meetingTemplate?.usersPosition?.[0].left}
            >
                <MeetingUserVideoItem
                    size={meeting?.sharingUserId ? 56 : 120}
                    userProfileAvatar={profile?.profileAvatar?.url || ''}
                    userName={localUser.username}
                    videoTrack={localUser.videoTrack}
                    audioTrack={localUser.audioTrack}
                    isCameraEnabled={localUser.cameraStatus === 'active'}
                    isMicEnabled={localUser.micStatus === 'active'}
                    withoutName={Boolean(meeting?.sharingUserId)}
                    isScreensharingUser={localUser.meetingUserId === meeting?.sharingUserId}
                    isLocal
                    isAuraActive={localUser.isAuraActive}
                />
            </MeetingUserVideoPositionWrapper>
            {renderUsers}
        </CustomGrid>
    );
});

export { MeetingUsersVideos };
