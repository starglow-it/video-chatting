import React, { memo, useEffect, useRef } from 'react';
import clsx from 'clsx';

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

// types
import { MeetingUserVideoItemProps } from './types';

// styles
import styles from './MeetingUserVideoItem.module.scss';

const MeetingUserVideoItem = memo(
    ({
        size,
        userName,
        userProfileAvatar,
        videoTrack,
        audioTrack,
        isCameraEnabled = true,
        isMicEnabled = true,
        isLocal,
        isAuraActive = false,
        isScreenSharing = false,
        isScreensharingUser = false,
        onToggleAudio,
        onToggleVideo,
    }: MeetingUserVideoItemProps) => {
        const container = useRef<HTMLVideoElement | null>(null);

        const mediaStreamRef = useRef(new MediaStream());

        useEffect(() => {
            if (videoTrack) {
                const videoTracks = mediaStreamRef.current.getVideoTracks();

                if (videoTracks.length) {
                    videoTracks.forEach(track => {
                        mediaStreamRef.current.removeTrack(track);
                    });
                }

                const nativeVideoTrack = videoTrack.getMediaStreamTrack();

                mediaStreamRef.current.addTrack(nativeVideoTrack);

                if (container.current) container.current.srcObject = mediaStreamRef.current;
            }
        }, [container.current, videoTrack]);

        return (
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
                        audioTrack={audioTrack}
                        isMicEnabled={isMicEnabled}
                        isAuraActive={isAuraActive}
                    />
                    <RoundedVideo
                        isLocal={isLocal}
                        isCameraActive={isCameraEnabled && !isScreensharingUser}
                        isVideoAvailable
                        userName={userName}
                        userProfilePhoto={userProfileAvatar}
                        videoRef={container}
                        size={size}
                        onToggleVideo={onToggleVideo}
                        isScreenSharing={isScreenSharing}
                    />
                    {isScreensharingUser && (
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
        );
    },
);

export { MeetingUserVideoItem };
