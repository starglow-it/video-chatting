import React, { memo } from 'react';
import clsx from 'clsx';

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
            onAction={onAction}
            className={clsx(styles.iconButton, { [styles.withAction]: Boolean(onAction) })}
            Icon={<SettingsIcon width="32px" height="32px" />}
        />
    </CustomPaper>
));

export { SetUpDevicesButton };
