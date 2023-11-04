import { memo, useCallback, useEffect, useRef } from 'react';
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
import { EditRoundIcon } from 'shared-frontend/icons/OtherIcons/EditRoundIcon';
import styles from './MediaPreview.module.scss';
import { MediaPreviewProps } from './types';

const Component = ({
    videoError,
    isCameraActive,
    stream,
    onToggleVideo,
    profileAvatar,
    userName,
    devicesSettingsDialog = false,
}: MediaPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
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

    const isVideoDisabled = !stream?.id || Boolean(videoError);

    const anchor = document.getElementById('anchor-unlock');

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
                alignItems="center"
                className={styles.mediaWrapper}
            >
                {/* {isNeedToRenderDevices && (
                    <VolumeAnalyzer
                        key={stream?.id}
                        indicatorsNumber={isMobile ? 9 : 6}
                    />
                )} */}
                <ActionButton
                    onAction={onToggleSwitch}
                    className={styles.btnEdit}
                    sx={{
                        width: {
                            xs: '100px',
                            sm: '143px',
                            md: '143px',
                            xl: '143px',
                        },
                        height: {
                            xs: '50px',
                            sm: '32px',
                            md: '32px',
                            xl: '32px',
                        },
                    }}
                    Icon={
                        <>
                            <span className={styles.textAvatar}>
                                Replace with Avatar
                            </span>
                            <EditRoundIcon width="22px" height="22px" />
                        </>
                    }
                />
                <CustomPopover
                    id="choose-avatar"
                    open={value}
                    onClose={onToggleSwitch}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    anchorEl={anchor}
                >
                    <MeetingAvatars
                        devicesSettingsDialog={devicesSettingsDialog}
                        onClose={onToggleSwitch}
                    />
                </CustomPopover>
                {/* <ConditionalRender condition={isUnlockAccess}>
                    <CustomTypography
                        nameSpace="meeting"
                        translation="unlockAccess.link"
                        onClick={onToggleUnlock}
                        className={styles.unlockTitle}
                    />
                    <CustomPopover
                        id="unlock-access"
                        open={isShowUnlock}
                        onClose={onToggleUnlock}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        anchorEl={anchor}
                    >
                        <UnlockAccess />
                    </CustomPopover>
                </ConditionalRender> */}
            </CustomGrid>
        </CustomGrid>
    );
};

export const MediaPreview = memo(Component);
