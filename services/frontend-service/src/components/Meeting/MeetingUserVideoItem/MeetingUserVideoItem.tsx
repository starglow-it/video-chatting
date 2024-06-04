import { memo, SyntheticEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';

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
import { CustomResizable } from '@library/custom/CustomResizable/CustomResizable';
import { ResizeCallbackData } from 'react-resizable';
import { $windowSizeStore, addNotificationEvent } from 'src/store';
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { $isCameraActiveStore, $isOwner, $meetingStore, $tracksStore, $videoErrorStore, setIsCameraActiveEvent, updateUserSocketEvent } from '../../../store/roomStores';

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

    const [isVideoSelfView, setVideoSelfView] =
        useState<boolean>(isCameraEnabled);
    const isCameraActive = useStore($isCameraActiveStore);
    const videoError = useStore($videoErrorStore);
    const isVideoError = Boolean(videoError);


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

            handleRemoveBackground(mediaStreamRef.current, isAuraActive, stream => {
                mediaStreamRef.current = stream;
            });

            if (container.current)
                container.current.srcObject = mediaStreamRef.current;
        }
    }, [localStream, userTracks, isVideoSelfView, isAuraActive]);

    const handleResize = (e: SyntheticEvent, data: ResizeCallbackData) => {
        setScale(data.size.width);
    };

    const handleResizeStart = (e: SyntheticEvent) => {
        e.stopPropagation();
    };

    const handleResizeStop = (e: SyntheticEvent, data: ResizeCallbackData) => {
        if (onResizeVideo) onResizeVideo(data.size.width / resizeCoeff, userId);
    };
    return (
        <CustomResizable
            width={scale}
            height={scale}
            onResize={handleResize}
            minConstraints={[75, 75]}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
            resizeHandles={['se']}
            disabled={!isScreenSharing ? (!isOwner ? !isLocal : false) : true}
        >
            <CustomBox
                className={clsx(styles.media)}
                sx={{
                    width: `${scale}px`,
                    height: `${scale}px`,
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
        </CustomResizable>
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
    const { isMobile } = useBrowserDetect();
    const resizeCoeff = width / window.screen.width;
    const baseSize = size || (isMobile ? 75 : 150);
    const coefValue = baseSize * resizeCoeff;
    const videoSizeForBigScreen = coefValue > baseSize ? baseSize : coefValue;
    const videoSizeForMeeting = coefValue < 75 ? 75 : videoSizeForBigScreen;
    const videoSize = isScreenSharing ? 56 : videoSizeForMeeting;

    const [scale, setScale] = useState<number>(videoSize);
    const meeting = useStore($meetingStore);

    useEffect(() => {
        setScale(videoSize);
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
        <MeetingUserVideoPositionWrapper
            bottom={bottom}
            left={left}
            isScreenSharing={isScreenSharing}
            isLocal={isLocal}
            size={size}
            userId={userId}
            isOwner={isOwner}
        >
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                gap={1.625}
            >
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
            </CustomGrid>
            {userId !== meeting.hostUserId ? < EmojiPlayground userId={userId} /> : null}
        </MeetingUserVideoPositionWrapper>
    );
};

export const MeetingUserVideoItem = memo(Component);
