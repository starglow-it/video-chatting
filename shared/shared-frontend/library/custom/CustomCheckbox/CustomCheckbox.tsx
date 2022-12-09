import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from "@mui/material/FormControlLabel";
import {alpha} from "@mui/material/styles";

// icons
import { CheckIcon } from '../../../icons/OtherIcons/CheckIcon';
import { CustomCheckboxProps } from './types';

// styles
import styles from './CustomCheckbox.module.scss';

const Component: React.FunctionComponent<CustomCheckboxProps> = (
    { className, label, labelClassName, ...rest },
    ref: ForwardedRef<HTMLInputElement>,
) => (
    <FormControlLabel
        classes={{
            root: clsx(styles.label, labelClassName),
            label: styles.labelText,
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
        label={label}
    />
);

const CustomCheckbox = memo(forwardRef(Component));

export default CustomCheckbox;
