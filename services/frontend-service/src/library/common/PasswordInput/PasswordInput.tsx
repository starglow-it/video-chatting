import React, { ForwardedRef, forwardRef, memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import clsx from 'clsx';

// hooks
import { useLocalization } from '@hooks/useTranslation';
import { useToggle } from '@hooks/useToggle';

// components
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';
import { EyeVisibilityIcon } from 'shared-frontend/icons';

// custom
import { CustomGrid } from 'shared-frontend/library';

// styles
import styles from '@library/custom/CustomInput/CustomInput.module.scss';

// types
import { TranslationProps } from '@library/common/Translation/types';
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { PasswordInputProps } from './types';

type ComponentProps = PasswordInputProps &
    Omit<TextFieldProps, 'error' | 'children'> &
    TranslationProps;

const Component = (
    {
        onFocus,
        onCustomBlur,
        onBlur,
        nameSpace,
        translation,
        error,
        fieldKey = 'password',
        InputProps,
        errorClassName,
        ...rest
    }: ComponentProps,
    ref: ForwardedRef<HTMLInputElement>,
) => {
    const { value: showPass, onToggleSwitch: handleTogglePassword } = useToggle(false);

    const { control } = useFormContext();

    const passwordValue = useWatch({ control, name: fieldKey });

    const t = useLocalization(nameSpace);

    const label = useMemo(() => (translation ? t.translation(translation) : ''), [translation]);

    const handleBlur = useCallback(
        e => {
            if (!passwordValue) {
                onCustomBlur?.();
            }
            onBlur?.(e);
        },
        [passwordValue],
    );

    return (
        <CustomGrid container direction="column">
            <TextField
                inputRef={ref}
                type={showPass ? 'text' : 'password'}
                label={label || 'Password'}
                onBlur={handleBlur}
                onFocus={onFocus}
                error={Boolean(error)}
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
            {error && (
                <ErrorMessage
                    className={clsx(styles.errorContainer, errorClassName)}
                    error={error}
                />
            )}
        </CustomGrid>
    );
};

export const PasswordInput = memo<ComponentProps>(
    forwardRef<HTMLInputElement, ComponentProps>(Component),
);
