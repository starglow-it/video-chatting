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
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { CameraIcon } from 'shared-frontend/icons/OtherIcons/CameraIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

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
        <CustomGrid className={clsx(styles.container)}>
            <CustomTypography fontSize="18px">
                Self View
            </CustomTypography>
            <CustomBox
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
            <CustomGrid container className={styles.controlsWrapper} justifyContent="center">
                <ActionButton
                    className={clsx(styles.controlBtn)}
                    Icon={
                        <MicIcon
                            width="24px"
                            height="24px"
                            // isActive={isMicActive}
                        />
                    }
                />

                <ActionButton
                    className={clsx(styles.controlBtn)}
                    Icon={
                        <CameraIcon
                            width="24px"
                            height="24px"
                            // isActive={isCameraActive}
                        />
                    }
                />
            </CustomGrid>
        </CustomGrid>
    );
};
