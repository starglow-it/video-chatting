import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

import { useStore } from 'effector-react';
import {
    $activeStreamStore,
    $localUserStore,
    $meetingConnectedStore,
    setDevicesPermission,
    setIsAudioActiveEvent,
    setIsCameraActiveEvent,
    updateLocalUserEvent,
} from 'src/store/roomStores';
import { $profileStore } from 'src/store';
import clsx from 'clsx';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';
import { useCallback, useEffect, useRef } from 'react';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { CameraIcon } from 'shared-frontend/icons/OtherIcons/CameraIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import styles from './MeetingSelfView.module.scss';

export const MeetingSelfView = () => {
    const localUser = useStore($localUserStore);
    const activeStream = useStore($activeStreamStore);
    const profile = useStore($profileStore);
    const isMeetingConnected = useStore($meetingConnectedStore);

    const container = useRef<HTMLVideoElement | null>(null);
    const mediaStreamRef = useRef(new MediaStream());

    const isMicActive = localUser.micStatus === 'active';
    const isCamActive = localUser.cameraStatus === 'active';

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

    const handleToggleMic = useCallback(() => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                micStatus: isMicActive ? 'inactive' : 'active',
            });
            setDevicesPermission({
                isMicEnabled: !isMicActive,
            });
            setIsAudioActiveEvent(!isMicActive);
        }
    }, [isMeetingConnected, isMicActive]);

    const handleToggleCam = useCallback(() => {
        if (isMeetingConnected) {
            updateLocalUserEvent({
                cameraStatus: isCamActive ? 'inactive' : 'active',
            });
            setDevicesPermission({
                isCamEnabled: !isCamActive,
            });
            setIsCameraActiveEvent(!isCamActive);
        }
    }, [isMeetingConnected, isCamActive]);

    return (
        <CustomGrid
            className={clsx(styles.container)}
            sx={{ top: { xs: '35%', sm: '28%', md: '28%', xl: '28%' } }}
            gap="10px"
        >
            <CustomTypography fontSize="18px">Self View</CustomTypography>
            <CustomBox
                sx={{
                    width: `170px`,
                    height: `170px`,
                }}
            >
                <RoundedVideo
                    isLocal
                    isCameraActive={isCamActive}
                    isVideoAvailable
                    userName={profile.fullName}
                    userProfilePhoto={profile.profileAvatar.url ?? ''}
                    videoRef={container}
                    size={170}
                    isSelfView={false}
                    isVideoSelfView={false}
                />
            </CustomBox>
            <CustomGrid
                container
                className={styles.controlsWrapper}
                justifyContent="center"
                sx={{
                    display: { xs: 'flex', sm: 'none', md: 'none', xl: 'none' },
                }}
            >
                <ActionButton
                    className={clsx(styles.controlBtn)}
                    onAction={handleToggleMic}
                    Icon={
                        <MicIcon
                            width="24px"
                            height="24px"
                            isActive={isMicActive}
                        />
                    }
                />

                <ActionButton
                    className={clsx(styles.controlBtn)}
                    onAction={handleToggleCam}
                    Icon={
                        <CameraIcon
                            width="24px"
                            height="24px"
                            isActive={isCamActive}
                        />
                    }
                />
            </CustomGrid>
        </CustomGrid>
    );
};
