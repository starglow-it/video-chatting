import React, { memo } from 'react';
import clsx from 'clsx';

import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

import { SharingIcon } from '@library/icons/SharingIcon';
import styles from './ScreenSharingButton.module.scss';

import { ScreenSharingButtonProps } from './types';

const ScreenSharingButton = memo(({ onAction, isSharingActive }: ScreenSharingButtonProps) => {
    const isThereAction = Boolean(onAction);

    return (
        <CustomTooltip
            classes={{ tooltip: styles.tooltip }}
            nameSpace="meeting"
            translation={
                isThereAction ? `modes.screensharing.${isSharingActive ? 'off' : 'on'}` : ''
            }
        >
            <CustomPaper variant="black-glass" className={styles.deviceButton}>
                <ActionButton
                    onAction={onAction}
                    className={clsx(styles.iconButton, {
                        [styles.withAction]: isThereAction,
                        [styles.active]: isSharingActive,
                    })}
                    Icon={<SharingIcon width="32px" height="32px" />}
                />
            </CustomPaper>
        </CustomTooltip>
    );
});

export { ScreenSharingButton };
