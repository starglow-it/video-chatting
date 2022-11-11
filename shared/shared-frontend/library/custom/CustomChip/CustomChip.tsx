import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';

import { Chip } from '@mui/material';

// types
import { CustomChipProps } from './types';

// styles
import styles from './CustomChip.module.scss';

const Component = (
    { active = false, className, withoutAction, label, ...rest }: CustomChipProps,
    ref: ForwardedRef<HTMLInputElement>,
) => (
    <Chip
        ref={ref}
        classes={{
            label: styles.label
        }}
        className={clsx(styles.chip, className, {
            [styles.active]: active,
            [styles.withoutAction]: withoutAction
        })}
        label={label}
        {...rest}
    />
);

const CustomChip = memo(forwardRef(Component));

export default CustomChip
