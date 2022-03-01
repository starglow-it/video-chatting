import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';

import { alpha, Checkbox } from '@mui/material';

import { CustomCheckboxProps } from './types';

// library
import { CheckIcon } from '@library/icons/CheckIcon';

import styles from './CustomCheckbox.module.scss';

const CustomCheckbox = memo(
    forwardRef(
        ({ className, ...rest }: CustomCheckboxProps, ref: ForwardedRef<HTMLInputElement>) => {
            return (
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
        },
    ),
);

export { CustomCheckbox };
