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
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { UnlockAccess } from '@components/Meeting/UnblockAccess/UnlockAccess';
import { PersonIcon } from 'shared-frontend/icons/OtherIcons/PersonIcon';
import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';
import { AuthorLogo } from 'shared-frontend/icons/OtherIcons/AuthorLogo';
import { EditRoundIcon } from 'shared-frontend/icons/OtherIcons/EditRoundIcon';
import { RoundArrowIcon } from 'shared-frontend/icons/RoundIcons/RoundArrowIcon';
import styles from './MediaPreview.module.scss';
import { MediaPreviewProps } from './types';

const Component = ({
    videoError,
    isCameraActive,
    stream,
    onToggleVideo,
    profileAvatar,
    userName,
    isUnlockAccess = false,
}: MediaPreviewProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [anchorElUnlock, setAnchorElUnlock] =
        useState<HTMLButtonElement | null>(null);

    const { value, onToggleSwitch } = useToggle(false);
    const { value: isShowUnlock, onToggleSwitch: onToggleUnlock } =
        useToggle(false);

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

    const handleAnchorUnlock = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElUnlock(event.currentTarget);
        onToggleUnlock();
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
                    onAction={handleAnchor}
                    className={styles.btnEdit}
                    Icon={
                        <>
                            <span style={{ marginRight: 3 }}>Avatar</span>
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
                    anchorEl={document.getElementById('anchor-unlock')}
                >
                    <MeetingAvatars />
                </CustomPopover>
                <ConditionalRender condition={isUnlockAccess}>
                    <CustomTypography
                        nameSpace="meeting"
                        translation="unlockAccess.link"
                        onClick={handleAnchorUnlock}
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
                        anchorEl={document.getElementById('anchor-unlock')}
                    >
                        <UnlockAccess />
                    </CustomPopover>
                </ConditionalRender>
            </CustomGrid>
        </CustomGrid>
    );
};

export const MediaPreview = memo(Component);
