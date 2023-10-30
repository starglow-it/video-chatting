import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import styles from './MeetingSelfView.module.scss';
import { MeetingUserVideoItem } from '../MeetingUserVideoItem/MeetingUserVideoItem';
import { useStore } from 'effector-react';
import {
    $activeStreamStore,
    $isOwner,
    $localUserStore,
} from 'src/store/roomStores';
import { $profileStore } from 'src/store';
import clsx from 'clsx';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';
import { useEffect, useRef } from 'react';

export const MeetingSelfView = () => {
    const localUser = useStore($localUserStore);
    const activeStream = useStore($activeStreamStore);
    const profile = useStore($profileStore);
    const isOwner = useStore($isOwner);

    const container = useRef<HTMLVideoElement | null>(null);
    const mediaStreamRef = useRef(new MediaStream());

    useEffect(() => {
        let videoTrack = null;
        const localStreamTrack = activeStream?.getVideoTracks?.()?.[0];
        if (localStreamTrack) {
            const cloneLocalStream = localStreamTrack.clone();
            cloneLocalStream.enabled = true;
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
    }, []);

    return (
        <CustomBox
            className={clsx(styles.container)}
            sx={{
                width: `170px`,
                height: `170px`,
            }}
        >
            <RoundedVideo
                isLocal
                isCameraActive
                isVideoAvailable
                userName={profile.fullName}
                userProfilePhoto={profile.profileAvatar.url ?? ''}
                videoRef={container}
                size={170}
                isSelfView
                isVideoSelfView
            />
        </CustomBox>
    );
};
