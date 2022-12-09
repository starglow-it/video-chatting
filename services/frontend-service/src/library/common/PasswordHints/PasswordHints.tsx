import clsx from 'clsx';
import { ValidationError } from 'yup';
import React, { memo, useMemo } from 'react';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';

// components
import { ErrorIcon } from 'shared-frontend/icons/OtherIcons/ErrorIcon';
import { SmallCheckIcon } from 'shared-frontend/icons/OtherIcons/SmallCheckIcon';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// styles
import styles from './PasswordHints.module.scss';

// types
import { PasswordHintsProps } from './types';

const HINTS = [
    {
        type: 'minLength',
        id: 0,
        message: 'should be at least 8 characters in length',
    },
    {
        type: 'characters',
        id: 1,
        message: 'should contain at least one letter and numerical digit',
    },
];

const PasswordHints = memo(({ show, fieldKey }: PasswordHintsProps) => {
    const { control } = useFormContext();

    const { isSubmitted, errors } = useFormState({ control });
    const passwordValue = useWatch({ control, name: fieldKey });

    const isPasswordLengthPassed = passwordValue?.length >= 8;
    const isPasswordContentPassed =
        passwordValue && /(?=.*[a-zA-Z])(?=.*\d).*/gm.test(passwordValue);

    const hints = useMemo(
        () =>
            HINTS.map(hint => {
                const isPasswordTypeError =
                    errors?.[fieldKey]?.find?.(
                        (error: ValidationError) => error.message === hint.type,
                    ) &&
                    !errors?.[fieldKey]?.find?.(
                        (error: ValidationError) => error.message === 'required',
                    );

                const isPasswordTypeActive =
                    (isPasswordLengthPassed && hint.type === 'minLength') ||
                    (isPasswordContentPassed && hint.type === 'characters');

                return (
                    <CustomGrid container key={hint.id} alignItems="center">
                        {isPasswordTypeError ? (
                            <ErrorIcon width="15px" height="15px" />
                        ) : (
                            <SmallCheckIcon
                                isActive={Boolean(isPasswordTypeActive)}
                                width="15px"
                                height="15px"
                            />
                        )}
                        <CustomTypography
                            nameSpace="errors"
                            translation={`user.pass.${hint.type}`}
                            sx={{
                                color: theme => {
                                    if (isPasswordTypeActive) {
                                        return theme.palette.success.main;
                                    }
                                    if (isPasswordTypeError) {
                                        return theme.palette.error.main;
                                    }
                                    return theme.palette.text.secondary;
                                },
                            }}
                            variant="body3"
                        />
                    </CustomGrid>
                );
            }),
        [errors?.[fieldKey], isPasswordLengthPassed, isPasswordContentPassed, isSubmitted],
    );

    return (
        <CustomGrid
            container
            className={clsx(styles.hintsWrapper, {
                [styles.showHints]: show,
            })}
        >
            {hints}
        </CustomGrid>
    );
});

export { PasswordHints };
