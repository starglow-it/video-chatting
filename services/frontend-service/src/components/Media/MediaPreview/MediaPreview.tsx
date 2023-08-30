import { memo, useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// components
import { RoundedVideo } from '@components/Media/RoundedVideo/RoundedVideo';

// types

// styles
import { MeetingAvatars } from '@components/Meeting/MeetingAvatars/MeetingAvatars';
import { CustomPopover } from '@library/custom/CustomPopover/CustomPopover';
import { useToggle } from 'shared-frontend/hooks/useToggle';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { HostIcon } from 'shared-frontend/icons/OtherIcons/HostIcon';
import styles from './MediaPreview.module.scss';
import { MediaPreviewProps } from './types';

const Component = ({
    videoError,
    isCameraActive,
    stream,
    onToggleVideo,
    profileAvatar,
    userName,
}: MediaPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const { value, onToggleSwitch } = useToggle(false);

    useEffect(() => {
        (async () => {
            if (stream && videoRef?.current) {
                videoRef.current.srcObject = stream;
            }
        })();
    }, [stream]);

    const { isMobile } = useBrowserDetect();

    const handleToggleVideo = useCallback(() => {
        onToggleVideo?.();
    }, [onToggleVideo]);

    const handleAnchor = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        onToggleSwitch();
    };

    const isVideoDisabled = !stream?.id || Boolean(videoError);

    return (
        <CustomGrid
            container
            direction={isMobile ? 'row' : 'column'}
            wrap="nowrap"
            className={clsx(styles.previewWrapper, {
                [styles.mobile]: isMobile,
            })}
        >
            <RoundedVideo
                isLocal
                isCameraActive={isCameraActive}
                isVideoAvailable={!isVideoDisabled}
                userName={userName}
                userProfilePhoto={profileAvatar}
                videoRef={videoRef}
                size={isMobile ? 99 : 116}
                className={styles.previewVideo}
                onToggleVideo={handleToggleVideo}
            />

            <CustomGrid
                container
                direction="column"
                className={styles.mediaWrapper}
            >
                {/* {isNeedToRenderDevices && (
                    <VolumeAnalyzer
                        key={stream?.id}
                        indicatorsNumber={isMobile ? 9 : 6}
                    />
                )} */}
                <ActionButton
                    onAction={handleAnchor}
                    Icon={<HostIcon width="22px" height="22px" />}
                />
                <CustomPopover
                    id="choose-avatar"
                    open={value}
                    onClose={onToggleSwitch}
                    anchorReference="anchorEl"
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    anchorEl={anchorEl}
                >
                    <MeetingAvatars />
                </CustomPopover>
            </CustomGrid>
        </CustomGrid>
    );
};

export const MediaPreview = memo(Component);
