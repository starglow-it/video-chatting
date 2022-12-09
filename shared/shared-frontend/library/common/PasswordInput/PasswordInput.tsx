import React, { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from "@mui/material/InputAdornment";

// hooks
import { useToggle } from '../../../hooks/useToggle';

// components
import { EyeVisibilityIcon } from '../../../icons/OtherIcons/EyeVisibilityIcon';

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

const PasswordInput = memo(forwardRef(Component));

export default PasswordInput;
