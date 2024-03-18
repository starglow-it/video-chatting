import { memo, useCallback, useMemo } from 'react';
import { MenuItem, Select } from '@mui/material';
import { useStore } from 'effector-react';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// common
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// icons
import { RoundArrowIcon } from 'shared-frontend/icons/RoundIcons/RoundArrowIcon';
import { CameraIcon } from 'shared-frontend/icons/OtherIcons/CameraIcon';
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';

// styles
import clsx from 'clsx';
import styles from './SelectDevices.module.scss';

// types
import { DeviceInputKindEnum } from '../../../const/media/DEVICE_KINDS';

// stores
import {
    $audioDevicesStore,
    $audioErrorStore,
    $changeStreamStore,
    $currentAudioDeviceStore,
    $currentVideoDeviceStore,
    $videoDevicesStore,
    $videoErrorStore,
    changeStreamFxWithStore,
    toggleEditRuumeSelectMenu
} from '../../../store/roomStores';

const Component = () => {
    const changeStream = useStore($changeStreamStore);
    const audioDevices = useStore($audioDevicesStore);
    const videoDevices = useStore($videoDevicesStore);
    const currentAudioDevice = useStore($currentAudioDeviceStore);
    const currentVideoDevice = useStore($currentVideoDeviceStore);
    const videoError = useStore($videoErrorStore);
    const audioError = useStore($audioErrorStore);

    const { isMobile } = useBrowserDetect();

    const handleChangeCamera = useCallback(
        ({ target: { value } }: any) => {
            changeStreamFxWithStore({
                kind: DeviceInputKindEnum.VideoInput,
                deviceId: value,
            });
        },
        [changeStream],
    );

    const handleChangeMic = useCallback(
        ({ target: { value } }: any) => {
            changeStreamFxWithStore({
                kind: DeviceInputKindEnum.AudioInput,
                deviceId: value,
            });
        },
        [changeStream],
    );

    const renderAudioDevicesMenuItems = useMemo(
        () =>
            audioDevices.map(audioDevice => (
                <MenuItem
                    key={audioDevice.deviceId}
                    value={audioDevice.deviceId}
                >
                    {audioDevice.label}
                </MenuItem>
            )),
        [audioDevices],
    );

    const renderVideoDevicesMenuItems = useMemo(
        () =>
            videoDevices.map(videoDevice => (
                <MenuItem
                    key={videoDevice.deviceId}
                    value={videoDevice.deviceId}
                >
                    {videoDevice.label}
                </MenuItem>
            )),
        [videoDevices],
    );

    const handleRenderVideoValue = useCallback(
        (value: any) => (
            <CustomGrid
                className={styles.activeItem}
                container
                alignItems="center"
                wrap="nowrap"
            >
                <CameraIcon
                    className={styles.activeIcon}
                    isActive
                    width="24px"
                    height="24px"
                />
                <CustomTypography className={styles.activeValue}>
                    {
                        videoDevices.find(device => device.deviceId === value)
                            ?.label
                    }
                </CustomTypography>
            </CustomGrid>
        ),
        [videoDevices],
    );

    const handleRenderAudioValue = useCallback(
        (value: any) => (
            <CustomGrid
                className={styles.activeItem}
                container
                alignItems="center"
                wrap="nowrap"
            >
                <MicIcon
                    className={styles.activeIcon}
                    isActive
                    width="24px"
                    height="24px"
                />
                <CustomTypography className={styles.activeValue}>
                    {
                        audioDevices.find(device => device.deviceId === value)
                            ?.label
                    }
                </CustomTypography>
            </CustomGrid>
        ),
        [audioDevices],
    );

    return (
        <>
            <ConditionalRender condition={!isMobile && videoError == null}>
                <Select
                    className={styles.selectDeviceInput}
                    value={currentVideoDevice}
                    onChange={handleChangeCamera}
                    onOpen={() => {
                        toggleEditRuumeSelectMenu(true);
                    }}
                    onClose={() => {
                        toggleEditRuumeSelectMenu(false);
                    }}
                    IconComponent={RoundArrowIcon}
                    MenuProps={{
                        disableScrollLock: true,
                    }}
                    renderValue={handleRenderVideoValue}
                >
                    {renderVideoDevicesMenuItems}
                </Select>
            </ConditionalRender>
            <ConditionalRender condition={!!!audioError}>
                <Select
                    className={clsx(styles.selectDeviceInput, {
                        [styles.mobile]: isMobile,
                    })}
                    classes={
                        isMobile
                            ? { select: styles.audioWrapperMobile }
                            : undefined
                    }
                    value={currentAudioDevice}
                    onChange={handleChangeMic}
                    onOpen={() => {
                        toggleEditRuumeSelectMenu(true);
                    }}
                    onClose={() => {
                        toggleEditRuumeSelectMenu(false);
                    }}
                    IconComponent={RoundArrowIcon}
                    MenuProps={{
                        disableScrollLock: true,
                    }}
                    renderValue={handleRenderAudioValue}
                >
                    {renderAudioDevicesMenuItems}
                </Select>
            </ConditionalRender>
        </>
    );
};

export const SelectDevices = memo(Component);
