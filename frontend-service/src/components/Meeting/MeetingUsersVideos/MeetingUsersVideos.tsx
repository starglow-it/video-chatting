import React, { memo, useCallback, useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';
import ClickAwayListener from '@mui/base/ClickAwayListener/ClickAwayListener';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// components
import { MeetingUserVideoItem } from '@components/Meeting/MeetingUserVideoItem/MeetingUserVideoItem';
import { MeetingUserVideoPositionWrapper } from '@components/Meeting/MeetingUserVideoPositionWrapper/MeetingUserVideoPositionWrapper';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// stores
import {
    $localUserStore,
    $meetingConnectedStore,
    $meetingUsersStore,
    updateLocalUserEvent,
    $profileStore,
    $meetingTemplateStore,
    $meetingStore,
    $windowSizeStore,
    $isScreensharingStore,
    $isSideUsersOpenStore,
    setIsSideUsersOpenEvent,
} from '../../../store';

// controller
import { AgoraController } from '../../../controllers/VideoChatController';

// types
import { MeetingAccessStatuses } from '../../../store/types';

import styles from './MeetingUsersVideos.module.scss';

const Component = () => {
    const localUser = useStore($localUserStore);
    const profile = useStore($profileStore);
    const meeting = useStore($meetingStore);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isScreenSharing = useStore($isScreensharingStore);
    const isSideUsersOpen = useStore($isSideUsersOpenStore);

    const { width } = useStore($windowSizeStore);

    const { isMobile } = useBrowserDetect();

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

    const resizeCoeff = width / window.screen.width;

    const isLocalMicActive = localUser.micStatus === 'active';
    const isLocalCamActive = localUser.cameraStatus === 'active';

    const baseSize = isMobile ? 90 : 120;

    const coefValue = baseSize * resizeCoeff;

    const videoSizeForBigScreen = coefValue > baseSize ? baseSize : coefValue;

    const videoSizeForMeeting = coefValue < 60 ? 60 : videoSizeForBigScreen;

    const videoSize = isScreenSharing ? 56 : videoSizeForMeeting;

    const renderUsers = useMemo(
        () =>
            users.map(user => (
                <MeetingUserVideoPositionWrapper
                    key={user.id}
                    isScreensharing={isScreenSharing}
                    bottom={user?.userPosition?.bottom}
                    left={user?.userPosition?.left}
                >
                    <MeetingUserVideoItem
                        size={videoSize}
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
        [users, meeting.sharingUserId, meetingTemplate.usersPosition, videoSize],
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

    const handleClosePanel = useCallback(() => {
        if (isSideUsersOpen) {
            setIsSideUsersOpenEvent(false);
        }
    }, [isSideUsersOpen]);

    if (isScreenSharing && isMobile) {
        return (
            <CustomGrid
                className={clsx(styles.usersWrapper, styles.sharing, styles.mobileSharing, {
                    [styles.open]: isSideUsersOpen,
                })}
            >
                <ConditionalRender condition={isSideUsersOpen}>
                    <ClickAwayListener onClickAway={handleClosePanel}>
                        <CustomGrid />
                    </ClickAwayListener>
                </ConditionalRender>
                {renderUsers}
                <MeetingUserVideoPositionWrapper
                    key={localUser.id}
                    isScreensharing={isScreenSharing}
                    bottom={localUser?.userPosition?.bottom}
                    left={localUser?.userPosition?.left}
                >
                    <MeetingUserVideoItem
                        size={videoSize}
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
            </CustomGrid>
        );
    }

    return (
        <CustomGrid
            className={clsx(styles.usersWrapper, {
                [styles.sharing]: isScreenSharing,
            })}
        >
            {renderUsers}
            <MeetingUserVideoPositionWrapper
                key={localUser.id}
                isScreensharing={isScreenSharing}
                bottom={localUser?.userPosition?.bottom}
                left={localUser?.userPosition?.left}
            >
                <MeetingUserVideoItem
                    size={videoSize}
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
                    onToggleAudio={isMobile ? undefined : handleToggleAudio}
                    onToggleVideo={handleToggleVideo}
                />
            </MeetingUserVideoPositionWrapper>
        </CustomGrid>
    );
};

export const MeetingUsersVideos = memo(Component);
