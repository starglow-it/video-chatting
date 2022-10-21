import React, { ForwardedRef, forwardRef, memo } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField/TextField';

// components
import { CustomGrid } from '../../custom/CustomGrid/CustomGrid';
import { RoundCloseIcon } from '../../../icons';

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
) => {
    console.log(rest);

    return (
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
};

const EmailInput = memo(forwardRef(Component));

export default EmailInput;
