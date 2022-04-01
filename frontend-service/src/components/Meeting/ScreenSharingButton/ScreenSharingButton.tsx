import React, { memo, useMemo } from 'react';
import clsx from 'clsx';

import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

import { SharingIcon } from '@library/icons/SharingIcon';
import styles from './ScreenSharingButton.module.scss';

import { ScreenSharingButtonProps } from './types';

const ScreenSharingButton = memo(({ onAction, isSharingActive }: ScreenSharingButtonProps) => {
    const isThereAction = Boolean(onAction);

    const tooltipTranslation = useMemo(() => {
        if (isThereAction) {
            return `modes.screensharing.${isSharingActive ? 'off' : 'on'}`;
        }
        if (!isThereAction && isSharingActive) {
            return 'modes.screensharing.busy';
        }
        return '';
    }, [isThereAction, isSharingActive]);

    return (
        <CustomTooltip
            classes={{ tooltip: styles.tooltip }}
            nameSpace="meeting"
            translation={tooltipTranslation}
        >
            <CustomPaper variant="black-glass" className={styles.deviceButton}>
                <ActionButton
                    onAction={onAction}
                    className={clsx(styles.iconButton, {
                        [styles.withAction]: isThereAction,
                        [styles.active]: isSharingActive && isThereAction,
                        [styles.noRights]: isSharingActive && !isThereAction
                    })}
                    Icon={<SharingIcon width="32px" height="32px" />}
                />
            </CustomPaper>
        </CustomTooltip>
    );
});

export { ScreenSharingButton };
