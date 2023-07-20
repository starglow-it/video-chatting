import { ForwardedRef, forwardRef, memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { IconButton, InputAdornment, TextField } from '@mui/material';

// hooks
import { useLocalization } from '@hooks/useTranslation';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// components
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

// types
import { TextFieldProps } from '@mui/material/TextField/TextField';
import { TranslationProps } from '@library/common/Translation/types';
import { EmailInputProps } from './types';

// styles
import styles from './EmailInput.module.scss';

const Component = (
    {
        error,
        onClear,
        nameSpace,
        translation,
        ...rest
    }: EmailInputProps & TranslationProps & Omit<TextFieldProps, 'error'>,
    ref: ForwardedRef<HTMLInputElement>,
) => {
    const { control } = useFormContext();

    const email = useWatch({ control, name: 'email' });

    const { translation: t } = useLocalization(nameSpace ?? 'forms');

    return (
        <CustomGrid container direction="column">
            <TextField
                inputRef={ref}
                label={t(translation ?? 'email')}
                error={Boolean(error)}
                InputProps={{
                    endAdornment: Boolean(email) && onClear && (
                        <InputAdornment position="end">
                            <IconButton onClick={onClear} edge="end">
                                <RoundCloseIcon width="24px" height="24px" />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                {...rest}
            />
            {error && (
                <ErrorMessage className={styles.errorContainer} error={error} />
            )}
        </CustomGrid>
    );
};

export const EmailInput = memo(forwardRef(Component));
