import React, { memo, useCallback, useContext, useMemo } from 'react';
import clsx from 'clsx';

import { MenuItem, Select } from '@mui/material';

import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { ArrowIcon } from '@library/icons/ArrowIcon';
import { CameraIcon } from '@library/icons/CameraIcon';
import { MicIcon } from '@library/icons/MicIcon';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

import { MediaContext } from '../../../contexts/MediaContext';

import { SelectDevicesProps } from './types';

import styles from './SelectDevices.module.scss';

import { DeviceInputKindEnum } from '../../../const/media/DEVICE_KINDS';

const SelectDevices = memo(({ className }: SelectDevicesProps) => {
    const {
        data: { changeStream, audioDevices, videoDevices, currentAudioDevice, currentVideoDevice },
        actions: { onChangeStream },
    } = useContext(MediaContext);

    const handleChangeCamera = useCallback(
        ({ target: { value } }) => {
            onChangeStream({
                kind: DeviceInputKindEnum.VideoInput,
                deviceId: value,
            });
        },
        [changeStream],
    );

    const handleChangeMic = useCallback(
        ({ target: { value } }) => {
            onChangeStream({
                kind: DeviceInputKindEnum.AudioInput,
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

    return (
        <CustomGrid container direction="column" className={clsx(styles.devicesWrapper, className)}>
            <Select
                className={styles.selectDeviceInput}
                value={currentVideoDevice}
                onChange={handleChangeCamera}
                IconComponent={ArrowIcon}
                MenuProps={{
                    disableScrollLock: true,
                }}
                renderValue={value => (
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
                            {videoDevices.find(device => device.deviceId === value)?.label}
                        </CustomTypography>
                    </CustomGrid>
                )}
            >
                {renderVideoDevicesMenuItems}
            </Select>
            <Select
                className={styles.selectDeviceInput}
                value={currentAudioDevice}
                onChange={handleChangeMic}
                IconComponent={ArrowIcon}
                MenuProps={{
                    disableScrollLock: true,
                }}
                renderValue={value => (
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
                            {audioDevices.find(device => device.deviceId === value)?.label}
                        </CustomTypography>
                    </CustomGrid>
                )}
            >
                {renderAudioDevicesMenuItems}
            </Select>
        </CustomGrid>
    );
});

export { SelectDevices };
