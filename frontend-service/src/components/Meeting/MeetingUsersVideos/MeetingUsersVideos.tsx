import React, {memo, useCallback, useMemo} from 'react';
import { useStore, useStoreMap } from 'effector-react';

// components
import { MeetingUserVideoItem } from '@components/Meeting/MeetingUserVideoItem/MeetingUserVideoItem';
import { MeetingUserVideoPositionWrapper } from '@components/Meeting/MeetingUserVideoPositionWrapper/MeetingUserVideoPositionWrapper';

// stores
import {$localUserStore, $meetingConnectedStore, $meetingUsersStore, updateLocalUserEvent} from '../../../store';
import { $profileStore } from '../../../store';
import { $meetingStore, $meetingTemplateStore } from '../../../store';

// controller
import {AgoraController} from "../../../controllers/VideoChatController";

// types
import { MeetingAccessStatuses } from '../../../store/types';

const MeetingUsersVideos = memo(() => {
    const localUser = useStore($localUserStore);
    const profile = useStore($profileStore);
    const meeting = useStore($meetingStore);
    const isMeetingConnected = useStore($meetingConnectedStore);
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

    const isLocalMicActive = localUser.micStatus === 'active';
    const isLocalCamActive = localUser.cameraStatus === 'active';

    const renderUsers = useMemo(
        () =>
            users.map((user, index) => (
                <MeetingUserVideoPositionWrapper
                    key={user.id}
                    elevationIndex={index + 1}
                    isScreensharing={isScreenSharing}
                    top={user?.userPosition?.top}
                    left={user?.userPosition?.left}
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
                        isAuraActive={user.isAuraActive}
                        isScreensharingUser={meeting.sharingUserId === user.meetingUserId}
                        isScreenSharing={isScreenSharing}
                    />
                </MeetingUserVideoPositionWrapper>
            )),
        [users, meeting.sharingUserId, meetingTemplate.usersPosition],
    );

    const handleToggleAudio = useCallback(() => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                micStatus: isLocalMicActive ? 'inactive' : 'active',
            });

            AgoraController.setTracksState({
                isCameraEnabled: isLocalCamActive,
                isMicEnabled: !isLocalMicActive,
            });
        }
    }, [isLocalMicActive, isLocalCamActive, isMeetingConnected]);

    const handleToggleVideo = useCallback(() => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                cameraStatus: isLocalCamActive ? 'inactive' : 'active',
            });

            AgoraController.setTracksState({
                isCameraEnabled: !isLocalCamActive,
                isMicEnabled: isLocalMicActive,
            });
        }
    }, [isLocalCamActive, isLocalMicActive, isMeetingConnected]);

    return (
        <>
            <MeetingUserVideoPositionWrapper
                elevationIndex={0}
                key={localUser.id}
                isScreensharing={Boolean(meeting.sharingUserId)}
                top={localUser?.userPosition?.top}
                left={localUser?.userPosition?.left}
            >
                <MeetingUserVideoItem
                    size={meeting?.sharingUserId ? 56 : 120}
                    userProfileAvatar={profile?.profileAvatar?.url || ''}
                    userName={localUser.username}
                    videoTrack={localUser.videoTrack}
                    audioTrack={localUser.audioTrack}
                    isCameraEnabled={isLocalCamActive}
                    isMicEnabled={isLocalMicActive}
                    isScreenSharing={isScreenSharing}
                    isScreensharingUser={localUser.meetingUserId === meeting?.sharingUserId}
                    isLocal
                    isAuraActive={localUser.isAuraActive}
                    onToggleAudio={handleToggleAudio}
                    onToggleVideo={handleToggleVideo}
                />
            </MeetingUserVideoPositionWrapper>
            {renderUsers}
        </>
    );
});

export { MeetingUsersVideos };
