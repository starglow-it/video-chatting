import React, { memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { MicIcon } from '@library/icons/MicIcon';

// styles
import styles from './DevicesSetUpButton.module.scss';

// types
import { AudioDeviceSetUpButtonProps } from './types';

const AudioDeviceSetUpButton = memo(
    ({ className, onClick, isMicActive }: AudioDeviceSetUpButtonProps) => {
        const isThereAction = Boolean(onClick);

        return (
            <CustomTooltip
                classes={{ tooltip: styles.tooltip }}
                nameSpace="meeting"
                translation={isThereAction ? `devices.turn${isMicActive ? 'Off' : 'On'}` : ''}
            >
                <CustomPaper variant="black-glass" className={clsx(styles.deviceButton, className)}>
                    <ActionButton
                        onAction={onClick}
                        className={clsx(styles.iconButton, { [styles.withAction]: isThereAction })}
                        Icon={<MicIcon width="32px" height="32px" isActive={isMicActive} />}
                    />
                </CustomPaper>
            </CustomTooltip>
        );
    },
);

export { AudioDeviceSetUpButton };
