import React, { memo, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

import { MicIcon } from '@library/icons/MicIcon';
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';
import { MeetingUserAudioItem } from '@components/Meeting/MeetingUserAudioItem/MeetingUserAudioItem';

import { SharingArrowIcon } from '@library/icons/SharingArrowIcon';
import { MeetingUserVideoItemProps } from './types';

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
        withoutName,
        isScreensharingUser = false,
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
                    className={styles.media}
                    sx={{
                        width: `${size}px`,
                        height: `${size}px`,
                    }}
                >
                    <MeetingUserAudioItem
                        isLocal={isLocal}
                        audioTrack={audioTrack}
                        isMicEnabled={isMicEnabled}
                    />
                    <RoundedVideo
                        isLocal={isLocal}
                        isCameraActive={isCameraEnabled && !isScreensharingUser}
                        userName={userName}
                        userProfilePhoto={userProfileAvatar}
                        videoRef={container}
                        size={size}
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
                {!withoutName && (
                    <CustomPaper className={styles.usernameWrapper} variant="black-glass">
                        <CustomGrid container alignItems="center" wrap="nowrap">
                            <MicIcon
                                isActive={isMicEnabled}
                                width="18px"
                                height="18px"
                                className={clsx(styles.micIcon, {
                                    [styles.noAudio]: !isMicEnabled,
                                })}
                            />
                            <CustomTypography
                                color="common.white"
                                variant="body2"
                                className={styles.username}
                            >
                                {userName}
                            </CustomTypography>
                        </CustomGrid>
                    </CustomPaper>
                )}
            </CustomGrid>
        );
    },
);

export { MeetingUserVideoItem };
