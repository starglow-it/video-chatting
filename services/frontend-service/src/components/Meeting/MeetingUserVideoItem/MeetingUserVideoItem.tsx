import React, { memo, SyntheticEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
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
import { $tracksStore } from '../../../store/roomStores';

// types
import { MeetingUserVideoItemProps } from './types';
import { ConnectionType, StreamType } from '../../../const/webrtc';

// styles
import styles from './MeetingUserVideoItem.module.scss';
import { getConnectionKey } from '../../../helpers/media/getConnectionKey';
import { CustomResizable } from '@library/custom/CustomResizable/CustomResizable';
import { ResizeCallbackData } from 'react-resizable';

// utils

const Component = ({
    size,
    userId,
    userName,
    localStream,
    userProfileAvatar,
    onToggleAudio,
    onToggleVideo,
    bottom,
    left,
    isCameraEnabled = true,
    isMicEnabled = true,
    isLocal = false,
    isAuraActive = false,
    isScreenSharing = false,
    isScreenSharingUser = false,
    onResizeVideo
}: MeetingUserVideoItemProps) => {
    const container = useRef<HTMLVideoElement | null>(null);
    const [scale, setScale] = useState<number>(size)

    useEffect(() => {
        setScale(size)
    },[size])

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

    const mediaStreamRef = useRef(new MediaStream());

    useEffect(() => {
        const videoTrack = isLocal ? localStream?.getVideoTracks?.()?.[0] : userTracks?.videoTrack;

        if (videoTrack) {
            const videoTracks = mediaStreamRef.current.getVideoTracks();

            if (videoTracks.length) {
                videoTracks.forEach(track => {
                    mediaStreamRef.current.removeTrack(track);
                });
            }

            mediaStreamRef.current.addTrack(videoTrack);

            if (container.current) container.current.srcObject = mediaStreamRef.current;
        }
    }, [localStream, userTracks]);

    const handleResize = (e: SyntheticEvent, data: ResizeCallbackData) => {
        setScale(data.size.width);
    };

    const handleResizeStart = (e: SyntheticEvent) => {
        e.stopPropagation();
    };

    const handleResizeStop = (e: SyntheticEvent, data: ResizeCallbackData) => {
        isLocal && onResizeVideo(data.size.width || 0);
    };

    return (
        <MeetingUserVideoPositionWrapper
            bottom={bottom}
            left={left}
            isScreenSharing={isScreenSharing}
            isLocal={isLocal}
            size={size}
        >
            <CustomResizable
                width={scale}
                height={scale}
                onResize={handleResize}
                maxConstraints={[170, 170]}
                minConstraints={[size, size]}
                onResizeStart={handleResizeStart}
                onResizeStop={handleResizeStop}
                resizeHandles={['sw' , 'nw' , 'se' , 'ne']}
            >
            <CustomGrid container direction="column" alignItems="center">
                <CustomBox
                    className={clsx(styles.media, {
                        [styles.aura]: isAuraActive && isCameraEnabled,
                    })}
                    sx={{
                        width: `${scale}px`,
                        height: `${scale}px`,
                    }}
                >
                    <MeetingUserAudioItem
                        isLocal={isLocal}
                        audioTrack={localStream?.getAudioTracks?.()?.[0] ?? userTracks?.audioTrack}
                        isMicEnabled={isMicEnabled}
                        isAuraActive={isAuraActive}
                    />
                    <RoundedVideo
                        isLocal={isLocal}
                        isCameraActive={isCameraEnabled}
                        isVideoAvailable
                        userName={userName}
                        userProfilePhoto={userProfileAvatar}
                        videoRef={container}
                        size={scale}
                        onToggleVideo={onToggleVideo}
                        isScreenSharing={isScreenSharing}
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
                <ConditionalRender condition={(isScreenSharing && isLocal) || !isScreenSharing}>
                    <CustomPaper
                        className={clsx(styles.usernameWrapper, {
                            [styles.forSharing]: isScreenSharing && isLocal,
                        })}
                        variant="black-glass"
                    >
                        {((isScreenSharing && isLocal) || !isScreenSharing) && (
                            <MicIcon
                                isActive={isMicEnabled}
                                width={isScreenSharing && isLocal ? '16px' : '18px'}
                                height={isScreenSharing && isLocal ? '16px' : '18px'}
                                onClick={onToggleAudio}
                                className={clsx(styles.micIcon, {
                                    [styles.noAudio]: !isMicEnabled,
                                    [styles.withAction]: isLocal,
                                })}
                            />
                        )}
                        {!isScreenSharing && (
                            <CustomTypography
                                color="common.white"
                                variant="body3"
                                className={styles.username}
                            >
                                {userName}
                            </CustomTypography>
                        )}
                    </CustomPaper>
                </ConditionalRender>
            </CustomGrid>
            </CustomResizable>
        </MeetingUserVideoPositionWrapper>
    );
};

export const MeetingUserVideoItem = memo(Component);
