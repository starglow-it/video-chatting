import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingUser } from 'src/store/types';
import { useStore } from 'effector-react';
import { $tracksStore } from 'src/store/roomStores';
import { getConnectionKey } from 'src/helpers/media/getConnectionKey';
import { ConnectionType, StreamType } from 'src/const/webrtc';
import { getAvatarUrlMeeting } from 'src/utils/functions/getAvatarMeeting';
import { $avatarsMeetingStore } from 'src/store/roomStores/meeting/meetingAvatar/model';
import { $isPortraitLayout, $windowSizeStore } from 'src/store';
import { VideoItem } from './VideoItem';
import styles from './MeetingCarousel.module.scss';

export const MeetingVideosCarousel = ({ users }: { users: MeetingUser[] }) => {
    const tracksStore = useStore($tracksStore);
    const {
        avatar: { list },
    } = useStore($avatarsMeetingStore);

    const { width } = useStore($windowSizeStore);
    const isPortraitLayout = useStore($isPortraitLayout);

    const videoSize = Math.ceil((width - 36 - 120) / 2);

    if (!users.length) return null;

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
                        <VideoItem
                            id={item.id}
                            userTracks={
                                tracksStore[
                                    `${getConnectionKey({
                                        userId: item.id,
                                        connectionType: ConnectionType.VIEW,
                                        streamType: StreamType.VIDEO_CHAT,
                                    })}`
                                ]
                            }
                            isAuraActive={item.isAuraActive}
                            isCameraEnabled={item.cameraStatus === 'active'}
                            isMicEnabled={item.micStatus === 'active'}
                            userName={item.username}
                            userProfilePhoto={
                                getAvatarUrlMeeting(
                                    item.meetingAvatarId ?? '',
                                    list,
                                ) ?? item.profileAvatar
                            }
                            videoSize={videoSize}
                        />
                    ))}
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};
