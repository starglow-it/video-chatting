import React, { forwardRef, memo, ForwardedRef } from 'react';
import { TextField } from '@mui/material';

// types
import { CustomInputProps } from './types';

const Component = (
    { error, label, ...rest }: CustomInputProps,
    ref: ForwardedRef<HTMLInputElement>,
) => {
    return (
        <TextField inputRef={ref} label={label} error={Boolean(error)} {...rest} />
    );
};

const CustomInput = memo(forwardRef(Component));

export default CustomInput;
