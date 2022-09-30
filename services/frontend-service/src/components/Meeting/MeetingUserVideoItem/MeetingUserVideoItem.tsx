import React, { memo, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useStoreMap } from 'effector-react';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { MicIcon } from '@library/icons/MicIcon';
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';
import { MeetingUserAudioItem } from '@components/Meeting/MeetingUserAudioItem/MeetingUserAudioItem';
import { SharingArrowIcon } from '@library/icons/SharingArrowIcon';
import { MeetingUserVideoPositionWrapper } from '@components/Meeting/MeetingUserVideoPositionWrapper/MeetingUserVideoPositionWrapper';

// stores
import { $tracksStore } from '../../../store/roomStores';

// types
import { MeetingUserVideoItemProps } from './types';
import { ConnectionType, StreamType } from '../../../const/webrtc';

// styles
import styles from './MeetingUserVideoItem.module.scss';

// utils
import { getConnectionKey } from '../../../store/roomStores/videoChat/helpers/getConnectionKey';

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
}: MeetingUserVideoItemProps) => {
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

    return (
        <MeetingUserVideoPositionWrapper
            bottom={bottom}
            left={left}
            isScreenSharing={isScreenSharing}
        >
            <CustomGrid container direction="column" alignItems="center">
                <CustomBox
                    className={clsx(styles.media, {
                        [styles.aura]: isAuraActive && isCameraEnabled,
                    })}
                    sx={{
                        width: `${size}px`,
                        height: `${size}px`,
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
                        size={size}
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
        </MeetingUserVideoPositionWrapper>
    );
};

export const MeetingUserVideoItem = memo(Component);
