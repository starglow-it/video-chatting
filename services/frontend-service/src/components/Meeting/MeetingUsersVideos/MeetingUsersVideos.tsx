import { memo, useCallback, useMemo } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';
import { ClickAwayListener } from '@mui/base';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// components
import { MeetingUserVideoItem } from '@components/Meeting/MeetingUserVideoItem/MeetingUserVideoItem';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// stores
import { MeetingAccessStatusEnum } from 'shared-types';
import { getAvatarUrlMeeting } from 'src/utils/functions/getAvatarMeeting';
import { $avatarsMeetingStore } from 'src/store/roomStores/meeting/meetingAvatar/model';
import {
    $profileStore,
    $isSideUsersOpenStore,
    setIsSideUsersOpenEvent,
} from '../../../store';
import {
    $activeStreamStore,
    $isOwner,
    $isScreenSharingStore,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    $meetingTemplateStore,
    $meetingUsersStore,
    $tracksStore,
    setDevicesPermission,
    updateLocalUserEvent,
    updateUserSocketEvent,
} from '../../../store/roomStores';

// types

import styles from './MeetingUsersVideos.module.scss';

const Component = () => {
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isScreenSharing = useStore($isScreenSharingStore);
    const activeStream = useStore($activeStreamStore);
    const tracks = useStore($tracksStore)
    console.log('#Duy Phan console tracks', tracks)
    const {
        avatar: { list },
    } = useStore($avatarsMeetingStore);

    const profile = useStore($profileStore);
    const isSideUsersOpen = useStore($isSideUsersOpenStore);
    const isOwner = useStore($isOwner);
    const { isMobile } = useBrowserDetect();

    const users = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.filter(
                user =>
                    user.accessStatus === MeetingAccessStatusEnum.InMeeting &&
                    localUser.id !== user.id,
            ),
    });

    const isLocalMicActive = localUser.micStatus === 'active';
    const isLocalCamActive = localUser.cameraStatus === 'active';

    const handleResizeVideo = (userSize: number, userId: string) => {
        updateUserSocketEvent({
            id: userId,
            userSize,
        });
    };

    const renderUsers = useMemo(
        () =>
            users.map(user => (
                <MeetingUserVideoItem
                    userId={user.id}
                    key={user.id}
                    size={user.userSize || 0}
                    userName={user.username}
                    isCameraEnabled={user.cameraStatus === 'active'}
                    isMicEnabled={user.micStatus === 'active'}
                    userProfileAvatar={
                        getAvatarUrlMeeting(user.meetingAvatarId ?? '', list) ??
                        user.profileAvatar
                    }
                    isAuraActive={user.isAuraActive}
                    isScreenSharingUser={meeting.sharingUserId === user.id}
                    isScreenSharing={isScreenSharing}
                    bottom={user?.userPosition?.bottom}
                    left={user?.userPosition?.left}
                    isSelfView={false}
                    onResizeVideo={handleResizeVideo}
                    isOwner={isOwner}
                />
            )),
        [
            users,
            meeting.sharingUserId,
            meetingTemplate.usersPosition,
            isScreenSharing,
        ],
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

    const handleClosePanel = useCallback(() => {
        if (isSideUsersOpen) {
            setIsSideUsersOpenEvent(false);
        }
    }, [isSideUsersOpen]);

    if (isScreenSharing && isMobile) {
        return (
            <CustomGrid
                className={clsx(
                    styles.usersWrapper,
                    styles.sharing,
                    styles.mobileSharing,
                    {
                        [styles.open]: isSideUsersOpen,
                    },
                )}
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
                    size={localUser.userSize || 0}
                    userProfileAvatar={profile?.profileAvatar?.url || ''}
                    userName={localUser.username}
                    localStream={activeStream}
                    isCameraEnabled={isLocalCamActive}
                    isMicEnabled={isLocalMicActive}
                    isScreenSharing={isScreenSharing}
                    isScreenSharingUser={
                        localUser.id === meeting?.sharingUserId
                    }
                    isLocal
                    isAuraActive={localUser.isAuraActive}
                    onToggleAudio={handleToggleAudio}
                    bottom={localUser?.userPosition?.bottom}
                    left={localUser?.userPosition?.left}
                    isOwner={isOwner}
                />
            </CustomGrid>
        );
    }

    return (
        <CustomGrid
            className={clsx(styles.usersWrapper, {
                [styles.sharing]: isScreenSharing,
            })}
            id="drag-warpper"
        >
            {renderUsers}
            <MeetingUserVideoItem
                userId={localUser.id}
                key={localUser.id}
                size={localUser.userSize || 0}
                userProfileAvatar={
                    getAvatarUrlMeeting(
                        localUser.meetingAvatarId ?? '',
                        list,
                    ) ||
                    profile?.profileAvatar?.url ||
                    ''
                }
                userName={localUser.username}
                localStream={activeStream}
                isCameraEnabled={isLocalCamActive}
                isMicEnabled={isLocalMicActive}
                isScreenSharing={isScreenSharing}
                isScreenSharingUser={localUser.id === meeting?.sharingUserId}
                isLocal
                isAuraActive={localUser.isAuraActive}
                onToggleAudio={isMobile ? undefined : handleToggleAudio}
                bottom={localUser?.userPosition?.bottom}
                left={localUser?.userPosition?.left}
                onResizeVideo={handleResizeVideo}
                isOwner={isOwner}
            />
        </CustomGrid>
    );
};

export const MeetingUsersVideos = memo(Component);
