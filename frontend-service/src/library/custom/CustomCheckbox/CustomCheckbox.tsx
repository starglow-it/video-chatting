import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';

import { alpha, Checkbox } from '@mui/material';

// types
import { CustomCheckboxProps } from './types';

// icons
import { CheckIcon } from '@library/icons/CheckIcon';

// styles
import styles from './CustomCheckbox.module.scss';

const Component = (
    { className, ...rest }: CustomCheckboxProps,
    ref: ForwardedRef<HTMLInputElement>,
) => (
    <Checkbox
        inputRef={ref}
        disableRipple
        checkedIcon={<CheckIcon width="24px" height="24px" />}
        className={clsx(styles.checkbox, className)}
        sx={{
            background: theme => theme.background.default,
            border: theme => `1px solid ${alpha(theme.borderColor.primary, 0.6)}`,
        }}
        {...rest}
    />
);

export const CustomCheckbox = memo<CustomCheckboxProps>(
    forwardRef<HTMLInputElement, CustomCheckboxProps>(Component),
);
