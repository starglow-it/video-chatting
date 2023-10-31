import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

import clsx from 'clsx';
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { useEffect, useRef } from 'react';
import { TrackItem } from 'src/store/roomStores/videoChat/types';
import styles from './MeetingCarousel.module.scss';
import { MeetingUserAudioItem } from '../MeetingUserAudioItem/MeetingUserAudioItem';

type VideoItemProps = {
    stream: MediaStream;
    isCameraEnabled: boolean;
    userName: string;
    userProfilePhoto: string;
    userTracks: TrackItem;
    isAuraActive: boolean;
    isMicEnabled: boolean;
};

export const VideoItem = ({
    stream,
    isCameraEnabled,
    userName,
    userProfilePhoto,
    userTracks,
    isAuraActive,
    isMicEnabled,
}: VideoItemProps) => {
    const container = useRef<HTMLVideoElement | null>(null);
    const mediaStreamRef = useRef(new MediaStream());

    useEffect(() => {
        let videoTrack = null;
        const localStreamTrack = stream?.getVideoTracks?.()?.[0];
        if (localStreamTrack) {
            const cloneLocalStream = localStreamTrack.clone();
            cloneLocalStream.enabled = isCameraEnabled;
            videoTrack = cloneLocalStream;
        }

        if (videoTrack) {
            const videoTracks = mediaStreamRef.current.getVideoTracks();

            if (videoTracks.length) {
                videoTracks.forEach(track => {
                    mediaStreamRef.current.removeTrack(track);
                });
            }

            mediaStreamRef.current.addTrack(videoTrack);

            if (container.current)
                container.current.srcObject = mediaStreamRef.current;
        }
    }, [stream]);

    return (
        <CustomBox
            className={clsx(styles.videoItem)}
            sx={{
                width: `120px`,
            }}
        >
            <MeetingUserAudioItem
                isLocal={false}
                audioTrack={userTracks?.audioTrack}
                isMicEnabled={isMicEnabled}
                isAuraActive={isAuraActive}
            />
            <RoundedVideo
                isLocal
                isCameraActive
                isVideoAvailable
                userName={userName}
                userProfilePhoto={userProfilePhoto}
                videoRef={container}
                size={120}
                isSelfView={false}
                isVideoSelfView={false}
            />
            <CustomPaper
                className={clsx(styles.usernameWrapper)}
                variant="black-glass"
            >
                <CustomTypography
                    color="common.white"
                    variant="body3"
                    className={styles.username}
                >
                    {userName}
                </CustomTypography>
            </CustomPaper>
        </CustomBox>
    );
};
