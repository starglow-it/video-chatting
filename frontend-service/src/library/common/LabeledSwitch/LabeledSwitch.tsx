import React, { memo } from 'react';

// custom
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// styles
import styles from './LabeledSwitch.module.scss';

// types
import { LabeledSwitchProps } from './types';

const Component = ({
    Icon,
    nameSpace,
    translation,
    checked,
    onChange,
    className,
}: LabeledSwitchProps) => {
    return (
        <CustomGrid container gap={1} className={className}>
            {Icon}
            <CustomTypography nameSpace={nameSpace} translation={translation} />
            <CustomSwitch checked={checked} onChange={onChange} className={styles.switch} />
        </CustomGrid>
    );
};

export const LabeledSwitch = memo(Component);
