import React, { ForwardedRef, forwardRef, memo } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from "@mui/material/InputAdornment";

// components
import { RoundCloseIcon } from '../../../icons/RoundIcons/RoundCloseIcon';

// types
import { EmailInputProps } from './EmailInput.types';

const Component = (
    {
        error,
        onClear,
        label,
        ...rest
    }: EmailInputProps & Omit<TextFieldProps, 'error'>,
    ref: ForwardedRef<HTMLInputElement>,
) => (
    <TextField
        inputRef={ref}
        label={label}
        error={Boolean(error)}
        InputProps={{
            endAdornment: onClear && (
                <InputAdornment position="end">
                    <IconButton onClick={onClear} edge="end">
                        <RoundCloseIcon width="24px" height="24px" />
                    </IconButton>
                </InputAdornment>
            ),
        }}
        {...rest}
    />
);

const EmailInput = memo(forwardRef(Component));

export default EmailInput;
