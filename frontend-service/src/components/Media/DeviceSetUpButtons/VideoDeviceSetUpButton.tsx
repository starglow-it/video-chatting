import React, { memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CameraIcon } from '@library/icons/CameraIcon';

// styles
import styles from './DevicesSetUpButton.module.scss';

// types
import { VideoDeviceSetUpButtonProps } from './types';

const VideoDeviceSetUpButton = memo(
    ({ className, isCamActive = false, onClick }: VideoDeviceSetUpButtonProps) => {
        const isThereAction = Boolean(onClick);

        return (
            <CustomTooltip
                classes={{ tooltip: styles.tooltip }}
                nameSpace="meeting"
                translation={isThereAction ? `devices.turn${isCamActive ? 'Off' : 'On'}` : ''}
            >
                <CustomPaper variant="black-glass" className={clsx(styles.deviceButton, className)}>
                    <ActionButton
                        variant="transparentBlack"
                        onAction={onClick}
                        className={styles.iconButton}
                        Icon={<CameraIcon width="32px" height="32px" isActive={isCamActive} />}
                    />
                </CustomPaper>
            </CustomTooltip>
        );
    },
);

export { VideoDeviceSetUpButton };
