import { memo, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';

import { LocalVideoTrack } from 'livekit-client';
import { BackgroundBlur } from '@livekit/track-processors';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { SharingArrowIcon } from 'shared-frontend/icons/OtherIcons/SharingArrowIcon';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// common
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// components
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';
import { MeetingUserAudioItem } from '@components/Meeting/MeetingUserAudioItem/MeetingUserAudioItem';
import { MeetingUserVideoPositionWrapper } from '@components/Meeting/MeetingUserVideoPositionWrapper/MeetingUserVideoPositionWrapper';

// stores
import { $windowSizeStore, addNotificationEvent } from 'src/store';
import { $isCameraActiveStore, $isOwner, $meetingStore, $tracksStore, $videoErrorStore, setIsCameraActiveEvent, updateUserSocketEvent } from '../../../store/roomStores';
import { $isPortraitLayout } from 'src/store';

//hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// types
import { MeetingUserVideoComProps, MeetingUserVideoItemProps } from './types';
import { ConnectionType, StreamType } from '../../../const/webrtc';

// styles
import styles from './MeetingUserVideoItem.module.scss';
import { getConnectionKey } from '../../../helpers/media/getConnectionKey';
import { NotificationType } from 'src/store/types';
import { EmojiPlayground } from '../EmojiPlayground/EmojiPlayground';

// utils
import { handleRemoveBackground } from '../../../helpers/media/transparentBackground'

const MeetingUserVideoChildCom = ({
    isLocal,
    localStream,
    userId,
    isCameraEnabled,
    scale,
    isMicEnabled,
    userName,
    userProfileAvatar,
    isScreenSharing,
    isScreenSharingUser,
    isAuraActive,
    setScale,
    resizeCoeff,
    onResizeVideo,
}: MeetingUserVideoComProps) => {
    const mediaStreamRef = useRef(new MediaStream());
    const container = useRef<HTMLVideoElement | null>(null);
    const trackStore = useStore($tracksStore);
    const userTracks = useStoreMap({
        store: $tracksStore,
        keys: [
            getConnectionKey({
                userId,
                connectionType: ConnectionType.VIEW,
                streamType: StreamType.VIDEO_CHAT,
            }),
        ],
        fn: (tracks, [connectionId]) => tracks[connectionId],
    });
    const isOwner = useStore($isOwner);
    const isPortraitLayout = useStore($isPortraitLayout);

    const [isVideoSelfView, setVideoSelfView] =
        useState<boolean>(isCameraEnabled);
    const isCameraActive = useStore($isCameraActiveStore);
    const videoError = useStore($videoErrorStore);
    const isVideoError = Boolean(videoError);
    const { isSafari } = useBrowserDetect();

    const toggleSelfView = async () => {
        if (isVideoError) {
            addNotificationEvent({
                type: NotificationType.CamAction,
                message: `meeting.deviceErrors.${videoError?.type}`,
            });
        } else {
            setIsCameraActiveEvent(!isCameraActive);
            await updateUserSocketEvent({
                cameraStatus: !isCameraActive ? 'active' : 'inactive',
            });
            addNotificationEvent({
                type: NotificationType.DevicesAction,
                message: 'meeting.devices.saved',
            });
        }
    };

    useEffect(() => {
        if (!isLocal) setVideoSelfView(isCameraEnabled);
    }, [isCameraEnabled]);

    useEffect(() => {
        let videoTrack;
        if (isLocal) {
            const localStreamTrack = localStream?.getVideoTracks?.()?.[0];
            if (localStreamTrack) {
                const cloneLocalStream = localStreamTrack.clone();
                cloneLocalStream.enabled = isVideoSelfView;
                videoTrack = cloneLocalStream;
            }
        } else {
            videoTrack = userTracks?.videoTrack;
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
    }, [localStream, userTracks, isVideoSelfView, isAuraActive, isSafari]);

    return (
        <CustomBox
            className={clsx(styles.media)}
            sx={{
                width: isPortraitLayout ? `${scale}px` : '100px',
                height: isPortraitLayout ? `${scale}px` : '100px',
            }}
        >
            <MeetingUserAudioItem
                isLocal={isLocal}
                audioTrack={
                    localStream?.getAudioTracks?.()?.[0] ??
                    userTracks?.audioTrack
                }
                isMicEnabled={isMicEnabled}
                isAuraActive={false}
            />
            <RoundedVideo
                isLocal={isLocal}
                isCameraActive={isCameraEnabled}
                isVideoAvailable
                userName={userName}
                userProfilePhoto={userProfileAvatar}
                videoRef={container}
                size={scale}
                onToggleVideo={toggleSelfView}
                isScreenSharing={isScreenSharing}
                isVideoSelfView={isVideoSelfView}
            />
            {isScreenSharingUser && (
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    className={styles.activeSharing}
                >
                    <SharingArrowIcon width="16px" height="16px" />
                </CustomGrid>
            )}
        </CustomBox>
    );
};

const Component = ({
    size,
    userId,
    userName,
    localStream,
    userProfileAvatar,
    onToggleVideo,
    bottom,
    left,
    isCameraEnabled = true,
    isMicEnabled = true,
    isLocal = false,
    isAuraActive = false,
    isScreenSharing = false,
    isScreenSharingUser = false,
    onResizeVideo,
    isSelfView = true,
    isOwner,
}: MeetingUserVideoItemProps) => {
    const { width } = useStore($windowSizeStore);
    const resizeCoeff = width / window.screen.width;
    const baseSize = size || 100;
    const coefValue = baseSize * resizeCoeff;
    const videoSizeForBigScreen = coefValue > baseSize ? baseSize : coefValue;
    const videoSizeForMeeting = coefValue < 75 ? 75 : videoSizeForBigScreen;
    const videoSize = isScreenSharing ? 56 : videoSizeForMeeting;

    const [scale, setScale] = useState<number>(videoSize);
    const meeting = useStore($meetingStore);

    useEffect(() => {
        setScale(100);
    }, [size, width, isScreenSharing]);

    const childProps = {
        isLocal,
        localStream,
        userId,
        isCameraEnabled,
        scale,
        isMicEnabled,
        userName,
        userProfileAvatar,
        onToggleVideo,
        isScreenSharing,
        isScreenSharingUser,
        isAuraActive,
        isSelfView,
        setScale,
        resizeCoeff,
        onResizeVideo,
    };

    return (
        <CustomGrid container key={userId} direction="column" alignItems="center" gap="6px" style={{position: "relative"}}>
            <MeetingUserVideoChildCom {...childProps} />
            <ConditionalRender condition={!isScreenSharing}>
                <CustomPaper
                    className={clsx(styles.usernameWrapper, {
                        [styles.forSharing]: isScreenSharing && isLocal,
                    })}
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
            </ConditionalRender>
            <EmojiPlayground userId={userId} /> 
        </CustomGrid>
    );
};

export const MeetingUserVideoItem = memo(Component);
