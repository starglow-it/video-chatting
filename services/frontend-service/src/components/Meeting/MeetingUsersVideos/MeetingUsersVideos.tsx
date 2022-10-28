import React, { memo, useCallback, useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';
import { ClickAwayListener } from "@mui/base";

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// components
import { MeetingUserVideoItem } from '@components/Meeting/MeetingUserVideoItem/MeetingUserVideoItem';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// stores
import {
    $profileStore,
    $windowSizeStore,
    $isSideUsersOpenStore,
    setIsSideUsersOpenEvent,
} from '../../../store';
import {
    $activeStreamStore,
    $isScreenSharingStore,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    $meetingTemplateStore,
    $meetingUsersStore,
    setDevicesPermission,
    updateLocalUserEvent,
} from '../../../store/roomStores';

// types
import { MeetingAccessStatuses } from '../../../store/types';

import styles from './MeetingUsersVideos.module.scss';

const Component = () => {
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isScreenSharing = useStore($isScreenSharingStore);
    const activeStream = useStore($activeStreamStore);

    const profile = useStore($profileStore);
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
                <MeetingUserVideoItem
                    userId={user.id}
                    key={user.id}
                    size={videoSize}
                    userName={user.username}
                    isCameraEnabled={user.cameraStatus === 'active'}
                    isMicEnabled={user.micStatus === 'active'}
                    userProfileAvatar={user.profileAvatar}
                    isAuraActive={user.isAuraActive}
                    isScreenSharingUser={meeting.sharingUserId === user.id}
                    isScreenSharing={isScreenSharing}
                    bottom={user?.userPosition?.bottom}
                    left={user?.userPosition?.left}
                />
            )),
        [users, meeting.sharingUserId, meetingTemplate.usersPosition, videoSize, isScreenSharing],
    );

    const handleToggleAudio = useCallback(() => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                micStatus: isLocalMicActive ? 'inactive' : 'active',
            });
            setDevicesPermission({
                isMicEnabled: !isLocalMicActive,
            });
        }
    }, [isLocalMicActive, isLocalCamActive, isMeetingConnected]);

    const handleToggleVideo = useCallback(() => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                cameraStatus: isLocalCamActive ? 'inactive' : 'active',
            });

            setDevicesPermission({
                isCamEnabled: !isLocalCamActive,
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
                <MeetingUserVideoItem
                    key={localUser.id}
                    userId={localUser.id}
                    size={videoSize}
                    userProfileAvatar={profile?.profileAvatar?.url || ''}
                    userName={localUser.username}
                    localStream={activeStream}
                    isCameraEnabled={isLocalCamActive}
                    isMicEnabled={isLocalMicActive}
                    isScreenSharing={isScreenSharing}
                    isScreenSharingUser={localUser.id === meeting?.sharingUserId}
                    isLocal
                    isAuraActive={localUser.isAuraActive}
                    onToggleAudio={handleToggleAudio}
                    onToggleVideo={handleToggleVideo}
                    bottom={localUser?.userPosition?.bottom}
                    left={localUser?.userPosition?.left}
                />
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
            <MeetingUserVideoItem
                userId={localUser.id}
                key={localUser.id}
                size={videoSize}
                userProfileAvatar={profile?.profileAvatar?.url || ''}
                userName={localUser.username}
                localStream={activeStream}
                isCameraEnabled={isLocalCamActive}
                isMicEnabled={isLocalMicActive}
                isScreenSharing={isScreenSharing}
                isScreenSharingUser={localUser.id === meeting?.sharingUserId}
                isLocal
                isAuraActive={localUser.isAuraActive}
                onToggleAudio={isMobile ? undefined : handleToggleAudio}
                onToggleVideo={handleToggleVideo}
                bottom={localUser?.userPosition?.bottom}
                left={localUser?.userPosition?.left}
            />
        </CustomGrid>
    );
};

export const MeetingUsersVideos = memo(Component);
