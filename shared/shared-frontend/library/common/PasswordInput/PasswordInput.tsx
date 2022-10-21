import React, { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField/TextField';

// hooks
import { useToggle } from '../../../hooks';

// components
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { EyeVisibilityIcon } from '../../../icons';

// types
import { PasswordInputProps } from './PasswordInput.types';

type ComponentProps = PasswordInputProps & Omit<TextFieldProps, 'children'>;

const Component = (
    {
        onFocus,
        onCustomBlur,
        onBlur,
        error,
        label,
        InputProps,
        value,
        ...rest
    }: ComponentProps,
    ref: ForwardedRef<HTMLInputElement>,
) => {
    const { value: showPass, onToggleSwitch: handleTogglePassword } = useToggle(false);

    const handleBlur = useCallback(
        e => {
            if (!value) {
                onCustomBlur?.();
            }
            onBlur?.(e);
        },
        [value],
    );

    return (
        <TextField
            inputRef={ref}
            type={showPass ? 'text' : 'password'}
            label={label || 'Password'}
            onBlur={handleBlur}
            onFocus={onFocus}
            error={error}
            value={value}
            InputProps={{
                ...InputProps,
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                        >
                            <EyeVisibilityIcon
                                width="24px"
                                height="24px"
                                isVisible={showPass}
                            />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            {...rest}
        />
    );
};

const PasswordInput = memo<ComponentProps>(
    forwardRef<HTMLInputElement, ComponentProps>(Component),
);

export default PasswordInput;
