import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { MeetingUser } from 'src/store/types';
import styles from './MeetingCarousel.module.scss';
import { VideoItem } from './VideoItem';
import { useStore } from 'effector-react';
import { $tracksStore } from 'src/store/roomStores';
import { getConnectionKey } from 'src/helpers/media/getConnectionKey';
import { ConnectionType, StreamType } from 'src/const/webrtc';
import { getAvatarUrlMeeting } from 'src/utils/functions/getAvatarMeeting';
import { $avatarsMeetingStore } from 'src/store/roomStores/meeting/meetingAvatar/model';

export const MeetingVideosCarousel = ({ users }: { users: MeetingUser[] }) => {
    const tracksStore = useStore($tracksStore);
    const {
        avatar: { list },
    } = useStore($avatarsMeetingStore);

    if(!users.length) return null;
    return (
        <CustomGrid
            display="flex"
            flexWrap="wrap"
            gap={1}
            justifyContent="space-around"
            width="100%"
            marginTop={3}
            position="absolute"
            top="100px"
            padding="18px"
        >
            <CustomPaper variant="black-glass" className={styles.paper}>
                <CustomGrid
                    display="flex"
                    flexWrap="wrap"
                    gap={2}
                    justifyContent="space-around"
                    padding="10px"
                >
                    {users.map(item => (
                        <VideoItem
                            key={item.id}
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
                        />
                    ))}
                </CustomGrid>
            </CustomPaper>
        </CustomGrid>
    );
};
