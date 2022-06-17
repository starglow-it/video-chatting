import React, { memo } from 'react';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// components
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { SettingsIcon } from '@library/icons/SettingsIcon';

// styles
import styles from './DevicesSetUpButton.module.scss';

// types
import { ActionProps } from '../../../types';

const SetUpDevicesButton = memo(({ onAction }: ActionProps) => (
    <CustomPaper variant="black-glass" className={styles.deviceButton}>
        <ActionButton
            variant="transparentBlack"
            onAction={onAction}
            className={styles.iconButton}
            Icon={<SettingsIcon width="32px" height="32px" />}
        />
    </CustomPaper>
));

export { SetUpDevicesButton };
