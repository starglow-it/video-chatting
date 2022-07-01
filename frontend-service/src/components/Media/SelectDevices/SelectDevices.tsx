import React, {memo, useCallback, useContext, useMemo} from 'react';

import { MenuItem, Select } from '@mui/material';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// icons
import { RoundArrowIcon } from '@library/icons/RoundIcons/RoundArrowIcon';
import { CameraIcon } from '@library/icons/CameraIcon';
import { MicIcon } from '@library/icons/MicIcon';

// context
import { MediaContext } from '../../../contexts/MediaContext';

// styles
import styles from './SelectDevices.module.scss';

// types
import { DeviceInputKindEnum } from '../../../const/media/DEVICE_KINDS';

const SelectDevices = memo(() => {
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

    const handleRenderValue = useCallback(value => (
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
    ), [videoDevices]);

    return (
        <>
            <Select
                className={styles.selectDeviceInput}
                value={currentVideoDevice}
                onChange={handleChangeCamera}
                IconComponent={RoundArrowIcon}
                MenuProps={{
                    disableScrollLock: true,
                }}
                renderValue={handleRenderValue}
            >
                {renderVideoDevicesMenuItems}
            </Select>
            <Select
                className={styles.selectDeviceInput}
                value={currentAudioDevice}
                onChange={handleChangeMic}
                IconComponent={RoundArrowIcon}
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
        </>
    );
});

export { SelectDevices };
