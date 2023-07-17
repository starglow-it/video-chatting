import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { IconButton, InputAdornment } from '@mui/material';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useCountDown } from '@hooks/useCountDown';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { SuccessIcon } from 'shared-frontend/icons/OtherIcons/SuccessIcon';

// styles
import { Translation } from '@library/common/Translation/Translation';
import styles from './EnterCodeForm.module.scss';

const EnterCodeForm = memo(
    ({
        onCodeEntered,
        onCancel,
        onResendCode,
    }: {
        onResendCode: () => void;
        onCodeEntered: () => Promise<{ success: boolean }>;
        onCancel: () => void;
    }) => {
        const {
            register,
            setError,
            clearErrors,
            setFocus,
            control,
            formState: { errors },
        } = useFormContext();

        const { value: isCodeEntered, onSwitchOn: handleSetCodeEntered } =
            useToggle(false);

        const { value: secondsToNextResendCode, onStartCountDown } =
            useCountDown(30);

        const code = useWatch({
            control,
            name: 'code',
        });

        useEffect(() => {
            (async () => {
                if (code.length < 7 || code.length > 7) {
                    return clearErrors();
                }

                // TODO: throttle request
                const result = await onCodeEntered();

                if (result.success) {
                    handleSetCodeEntered();
                    clearErrors();
                } else {
                    setError('code', {
                        type: 'focus',
                        message: 'user.code.incorrect',
                    });
                    setFocus('code');
                }
            })();
        }, [onCodeEntered, code]);

        const handleResendCode = useCallback(() => {
            onStartCountDown();
            onResendCode();
        }, [onResendCode]);

        const resendText = useMemo(
            () =>
                !secondsToNextResendCode ? (
                    <CustomTypography
                        color="colors.blue.primary"
                        nameSpace="profile"
                        translation="editProfile.resendCode"
                        className={styles.resendCodeTest}
                        onClick={handleResendCode}
                    />
                ) : (
                    <CustomTypography color="colors.grayscale.normal">
                        {secondsToNextResendCode} sec till next resend
                    </CustomTypography>
                ),
            [handleResendCode, secondsToNextResendCode],
        );

        return (
            <CustomGrid container direction="column" gap={3}>
                <CustomGrid
                    container
                    direction="column"
                    alignItems="flex-start"
                >
                    <CustomTypography
                        nameSpace="profile"
                        translation="editProfile.verificationCode"
                    />
                    {!isCodeEntered && resendText}
                </CustomGrid>
                <CustomInput
                    nameSpace="profile"
                    translation="editProfile.code"
                    disabled={isCodeEntered}
                    error={errors?.code?.message}
                    InputProps={{
                        endAdornment: isCodeEntered && (
                            <InputAdornment position="end">
                                <IconButton edge="end" disableRipple>
                                    <SuccessIcon
                                        className={styles.successIcon}
                                        width="28px"
                                        height="28px"
                                    />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    {...register('code')}
                />
                <CustomGrid container gap={2} wrap="nowrap">
                    <CustomButton
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.cancel"
                            />
                        }
                        variant="custom-cancel"
                        onClick={onCancel}
                    />
                    <CustomButton
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.save"
                            />
                        }
                        disabled={!isCodeEntered}
                        type="submit"
                    />
                </CustomGrid>
            </CustomGrid>
        );
    },
);

export { EnterCodeForm };
