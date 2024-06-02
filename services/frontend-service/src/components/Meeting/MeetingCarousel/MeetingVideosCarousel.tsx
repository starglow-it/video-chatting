import { useCallback, useMemo } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingUser } from 'src/store/types';
import { useStore } from 'effector-react';
import { getAvatarUrlMeeting } from 'src/utils/functions/getAvatarMeeting';
import { $avatarsMeetingStore } from 'src/store/roomStores/meeting/meetingAvatar/model';
import { $isPortraitLayout } from 'src/store';
import { MeetingUserVideoItem } from '@components/Meeting/MeetingUserVideoItemForMobile/MeetingUserVideoItem';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

import {
    $activeStreamStore,
    $isOwner,
    $isAudience,
    $isScreenSharingStore,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    setDevicesPermission,
    updateLocalUserEvent,
    updateUserSocketEvent,
} from '../../../store/roomStores';
import { $profileStore } from 'src/store';

import { MeetingRole } from 'shared-types';

import styles from './MeetingCarousel.module.scss';

export const MeetingVideosCarousel = ({ users }: { users: MeetingUser[] }) => {
    const isPortraitLayout = useStore($isPortraitLayout);
    const activeStream = useStore($activeStreamStore);
    const localUser = useStore($localUserStore);
    const meeting = useStore($meetingStore);
    const isMeetingConnected = useStore($meetingConnectedStore);
    const isScreenSharing = useStore($isScreenSharingStore);
    const {
        avatar: { list },
    } = useStore($avatarsMeetingStore);
    const isAudience = useStore($isAudience);
    const profile = useStore($profileStore);

    const isOwner = useStore($isOwner);
    if (!users.length) return null;
    const isLocalMicActive = localUser.micStatus === 'active';
    const isLocalCamActive = localUser.cameraStatus === 'active';

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
            isScreenSharing,
        ],
    );

    return (
        <CustomGrid
            display="flex"
            flexWrap="wrap"
            gap={1}
            width="100%"
            sx={{
                top: { xs: '80px', sm: '35%', md: '26%', xl: '26%' },
            }}
            position="absolute"
            top="100px"
        >
            <CustomGrid className={styles.paper}>
                <CustomGrid
                    display="grid"
                    padding={isPortraitLayout ? '0px 18px' : '0px 50px'}
                    gridTemplateColumns="1fr 1fr"
                    sx={{
                        gridTemplateColumns: {
                            xs: '1fr 1fr',
                            sm: '1fr 1fr 1fr 1fr 1fr',
                            md: '1fr 1fr 1fr 1fr 1fr',
                            xl: '1fr 1fr 1fr 1fr 1fr',
                        },
                    }}
                    gridAutoRows="auto"
                    gap="14px"
                >
                    {renderUsers}
                    <ConditionalRender condition={!isAudience && localUser.meetingRole !== MeetingRole.Recorder}>
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
                    </ConditionalRender>
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};
