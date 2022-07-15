import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';

import {alpha, Checkbox, FormControlLabel} from '@mui/material';

// types
import { CustomCheckboxProps } from './types';

// icons
import { CheckIcon } from '@library/icons/CheckIcon';
import {Translation} from "@library/common/Translation/Translation";

// styles
import styles from './CustomCheckbox.module.scss';

const Component = (
    { className, translationProps, label, labelClassName, ...rest }: CustomCheckboxProps,
    ref: ForwardedRef<HTMLInputElement>,
) => (
    <FormControlLabel
        classes={{
            root: clsx(styles.label, labelClassName),
            label: styles.labelText
        }}
        control={
            <Checkbox
                inputRef={ref}
                disableRipple
                checkedIcon={<CheckIcon width="24px" height="24px" />}
                className={clsx(styles.checkbox, className)}
                sx={{
                    background: theme => theme.background.old,
                    border: theme => `1px solid ${alpha(theme.borderColor.primary, 0.6)}`,
                }}
                {...rest}
            />
        }
        label={label || (<Translation nameSpace={translationProps?.nameSpace} translation={translationProps?.translation} />)}
    />
);

export const CustomCheckbox = memo<CustomCheckboxProps>(
    forwardRef<HTMLInputElement, CustomCheckboxProps>(Component),
);
