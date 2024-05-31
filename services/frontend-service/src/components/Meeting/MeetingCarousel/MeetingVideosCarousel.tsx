import { useCallback } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingUser } from 'src/store/types';
import { useStore } from 'effector-react';
import { getAvatarUrlMeeting } from 'src/utils/functions/getAvatarMeeting';
import { $avatarsMeetingStore } from 'src/store/roomStores/meeting/meetingAvatar/model';
import { $isPortraitLayout } from 'src/store';
import { MeetingUserVideoItem } from '@components/Meeting/MeetingUserVideoItemForMobile/MeetingUserVideoItem';

import {
    $activeStreamStore,
    $isOwner,
    $isScreenSharingStore,
    $localUserStore,
    $meetingConnectedStore,
    $meetingStore,
    setDevicesPermission,
    updateLocalUserEvent,
    updateUserSocketEvent,
} from '../../../store/roomStores';

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
                    {users.map(item => (
                        <MeetingUserVideoItem
                            userId={item.id}
                            key={item.id}
                            size={item.userSize || 0}
                            userProfileAvatar={
                                getAvatarUrlMeeting(
                                    item.meetingAvatarId ?? '',
                                    list,
                                ) ?? item.profileAvatar
                            }
                            userName={item.username}
                            localStream={activeStream}
                            isCameraEnabled={isLocalCamActive}
                            isMicEnabled={isLocalMicActive}
                            isScreenSharing={isScreenSharing}
                            isScreenSharingUser={
                                item.id === meeting?.sharingUserId
                            }
                            isLocal
                            isAuraActive={item.isAuraActive}
                            onToggleAudio={handleToggleAudio}
                            bottom={item?.userPosition?.bottom}
                            left={item?.userPosition?.left}
                            onResizeVideo={handleResizeVideo}
                            isOwner={isOwner}
                        />
                    ))}
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};
