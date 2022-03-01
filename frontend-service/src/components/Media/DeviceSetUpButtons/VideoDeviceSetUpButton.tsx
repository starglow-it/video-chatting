import React, { memo } from 'react';
import clsx from 'clsx';

import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CameraIcon } from '@library/icons/CameraIcon';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

import styles from './DevicesSetUpButton.module.scss';

import { VideoDeviceSetUpButtonProps } from './types';

const VideoDeviceSetUpButton = memo(
    ({ className, isCamActive, onClick }: VideoDeviceSetUpButtonProps) => {
        const isThereAction = Boolean(onClick);

        return (
            <CustomTooltip
                classes={{ tooltip: styles.tooltip }}
                nameSpace="meeting"
                translation={isThereAction ? `devices.turn${isCamActive ? 'Off' : 'On'}` : ''}
            >
                <CustomPaper variant="black-glass" className={clsx(styles.deviceButton, className)}>
                    <ActionButton
                        onAction={onClick}
                        className={clsx(styles.iconButton, { [styles.withAction]: isThereAction })}
                        Icon={<CameraIcon width="32px" height="32px" isActive={isCamActive} />}
                    />
                </CustomPaper>
            </CustomTooltip>
        );
    },
);

export { VideoDeviceSetUpButton };
