import React, { memo, useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import Image from 'next/image';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { PasswordInput } from '@library/common/PasswordInput/PasswordInput';
import { PasswordHints } from '@library/common/PasswordHints/PasswordHints';

// styles
import styles from './ResetPassword.module.scss';

// validation
import { passwordSchema } from '../../validation/users/password';
import { simpleStringSchema } from '../../validation/common';

// stores
import { resetPasswordFx } from '../../store';

const validationSchema = yup.object({
    newPassword: passwordSchema().required('user.pass.newPassword.new'),
    newPasswordRepeat: simpleStringSchema().required('user.pass.newPassword.newRepeat'),
});

const Component = ({ onSuccessfulReset }: { onSuccessfulReset: () => void }) => {
    const router = useRouter();

    const isResetInProgress = useStore(resetPasswordFx.pending);

    const {
        value: showHints,
        onSwitchOn: handleShowHints,
        onSwitchOff: handleHideHints,
    } = useToggle(false);

    const resolver = useYupValidationResolver<{
        currentPassword: string;
        newPassword: string;
        newPasswordRepeat: string;
    }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            newPassword: '',
            newPasswordRepeat: '',
        },
    });

    const {
        handleSubmit,
        register,
        setError,
        formState: { errors },
    } = methods;

    const handleFocusInput = useCallback(() => {
        handleShowHints();
    }, []);

    const handleBlurInput = useCallback(() => {
        handleHideHints();
    }, []);

    const newPasswordErrorMessage = useMemo(() => {
        if (Array.isArray(errors?.newPassword)) {
            return errors?.newPassword?.find(item => item.type === 'required')?.message;
        }
        return errors?.newPassword?.message;
    }, [errors?.newPassword]);

    const onSubmit = useCallback(
        handleSubmit(async data => {
            if (data.newPassword !== data.newPasswordRepeat) {
                return setError('newPasswordRepeat', [
                    { message: 'user.pass.newPassword.notMatch' },
                ]);
            }

            const result = await resetPasswordFx({
                ...data,
                token: router?.query?.token as string,
            });

            if (result?.message) {
                setError('newPassword', { type: 'focus', message: result?.message });
            } else {
                onSuccessfulReset();
            }
        }),
        [],
    );

    return (
        <CustomGrid container direction="column" alignItems="center">
            <CustomGrid container alignItems="center" gap={1} justifyContent="center">
                <Image src="/images/lock.png" width="28px" height="28px" />
                <CustomTypography
                    variant="h2bold"
                    nameSpace="common"
                    translation="reset.newPasswordTitle"
                />
            </CustomGrid>
            <CustomTypography
                textAlign="center"
                className={styles.text}
                nameSpace="common"
                translation="reset.newPasswordText"
            />
            <FormProvider {...methods}>
                <form onSubmit={onSubmit} noValidate autoComplete="off">
                    <CustomGrid container className={styles.newPassword}>
                        <PasswordInput
                            fieldKey="newPassword"
                            nameSpace="common"
                            translation="reset.newPassword"
                            onFocus={handleFocusInput}
                            error={newPasswordErrorMessage}
                            {...register('newPassword')}
                            onCustomBlur={handleBlurInput}
                        />
                        <PasswordHints fieldKey="newPassword" show={showHints} />
                    </CustomGrid>
                    <PasswordInput
                        fieldKey="newPasswordRepeat"
                        nameSpace="common"
                        translation="reset.newPasswordRepeat"
                        error={errors?.newPasswordRepeat?.[0]?.message}
                        {...register('newPasswordRepeat')}
                    />
                    <CustomButton
                        type="submit"
                        nameSpace="common"
                        translation="reset.save"
                        disabled={isResetInProgress}
                        className={styles.button}
                    />
                </form>
            </FormProvider>
        </CustomGrid>
    );
};

export const ResetPassword = memo(Component);
