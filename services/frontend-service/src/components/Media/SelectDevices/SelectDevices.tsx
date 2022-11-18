import React, { memo, useCallback, useMemo } from 'react';
import { MenuItem, Select } from '@mui/material';
import { useStore } from 'effector-react';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { RoundArrowIcon } from 'shared-frontend/icons';
import { CameraIcon } from 'shared-frontend/icons';
import { MicIcon } from 'shared-frontend/icons';

// styles
import styles from './SelectDevices.module.scss';

// types
import { DeviceInputKindEnum } from '../../../const/media/DEVICE_KINDS';

// stores
import {
    $audioDevicesStore,
    $changeStreamStore,
    $currentAudioDeviceStore,
    $currentVideoDeviceStore,
    $videoDevicesStore,
    changeStreamFxWithStore,
} from '../../../store/roomStores';

const Component = () => {
    const changeStream = useStore($changeStreamStore);
    const audioDevices = useStore($audioDevicesStore);
    const videoDevices = useStore($videoDevicesStore);
    const currentAudioDevice = useStore($currentAudioDeviceStore);
    const currentVideoDevice = useStore($currentVideoDeviceStore);

    const { isMobile } = useBrowserDetect();

    const handleChangeCamera = useCallback(
        ({ target: { value } }) => {
            changeStreamFxWithStore({
                kind: DeviceInputKindEnum.VideoInput,
                deviceId: value,
            });
        },
        [changeStream],
    );

    const handleChangeMic = useCallback(
        ({ target: { value } }) => {
            changeStreamFxWithStore({
                kind: DeviceInputKindEnum.VideoInput,
                deviceId: value,
            });
        },
        [changeStream],
    );

    const renderAudioDevicesMenuItems = useMemo(
        () =>
            audioDevices.map(audioDevice => (
                <MenuItem key={audioDevice.deviceId} value={audioDevice.deviceId}>
                    {audioDevice.label}
                </MenuItem>
            )),
        [audioDevices],
    );

    const renderVideoDevicesMenuItems = useMemo(
        () =>
            videoDevices.map(videoDevice => (
                <MenuItem key={videoDevice.deviceId} value={videoDevice.deviceId}>
                    {videoDevice.label}
                </MenuItem>
            )),
        [videoDevices],
    );

    const handleRenderVideoValue = useCallback(
        value => (
            <CustomGrid className={styles.activeItem} container alignItems="center" wrap="nowrap">
                <CameraIcon className={styles.activeIcon} isActive width="24px" height="24px" />
                <CustomTypography className={styles.activeValue}>
                    {videoDevices.find(device => device.deviceId === value)?.label}
                </CustomTypography>
            </CustomGrid>
        ),
        [videoDevices],
    );

    const handleRenderAudioValue = useCallback(
        value => (
            <CustomGrid className={styles.activeItem} container alignItems="center" wrap="nowrap">
                <MicIcon className={styles.activeIcon} isActive width="24px" height="24px" />
                <CustomTypography className={styles.activeValue}>
                    {audioDevices.find(device => device.deviceId === value)?.label}
                </CustomTypography>
            </CustomGrid>
        ),
        [audioDevices],
    );

    return (
        <>
            <ConditionalRender condition={!isMobile}>
                <Select
                    className={styles.selectDeviceInput}
                    value={currentVideoDevice}
                    onChange={handleChangeCamera}
                    IconComponent={RoundArrowIcon}
                    MenuProps={{
                        disableScrollLock: true,
                    }}
                    renderValue={handleRenderVideoValue}
                >
                    {renderVideoDevicesMenuItems}
                </Select>
            </ConditionalRender>

            <Select
                className={styles.selectDeviceInput}
                value={currentAudioDevice}
                onChange={handleChangeMic}
                IconComponent={RoundArrowIcon}
                MenuProps={{
                    disableScrollLock: true,
                }}
                renderValue={handleRenderAudioValue}
            >
                {renderAudioDevicesMenuItems}
            </Select>
        </>
    );
};

export const SelectDevices = memo(Component);
