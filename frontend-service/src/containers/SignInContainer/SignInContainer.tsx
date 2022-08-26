import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';
import { ValidationError } from 'yup';
import * as yup from 'yup';
import { useMediaQuery } from '@mui/material';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// common
import { EmailInput } from '@library/common/EmailInput/EmailInput';
import { PasswordInput } from '@library/common/PasswordInput/PasswordInput';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';
import { CenteredPaper } from '@library/common/CenteredPaper/CenteredPaper';

// components
import { ForgotPassword } from '@components/ForgotPassword/ForgotPassword';
import { EmailResetPasswordDialog } from '@components/Dialogs/EmailResetPasswordDialog/EmailResetPasswordDialog';

// styles
import styles from './SignInContainer.module.scss';

// stores
import { $authStore, loginUserFx, resetAuthErrorEvent } from '../../store';

// types
import { LoginUserParams } from '../../store/types';

// validations
import { emailSchema } from '../../validation/users/email';
import { passwordLoginSchema } from '../../validation/users/password';
import { StorageKeysEnum, WebStorage } from '../../controllers/WebStorageController';
import { dashboardRoute, setUpTemplateRoute } from '../../const/client-routes';

const validationSchema = yup.object({
    email: emailSchema().required('required'),
    password: passwordLoginSchema().required('required'),
});

const Component = () => {
    const router = useRouter();
    const authState = useStore($authStore);

    const resolver = useYupValidationResolver<{ email: string; password: string }>(
        validationSchema,
    );

    const methods = useForm({
        resolver,
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        register,
        formState: { errors },
    } = methods;

    const [email, password] = useWatch({
        control,
        name: ['email', 'password'],
    });

    const isCredentialsEntered = password && email;

    useEffect(() => {
        if (authState.isAuthenticated) {
            const initialTemplateId = WebStorage.get<{ templateId: string }>({
                key: StorageKeysEnum.templateId,
            });

            const routeToChange = initialTemplateId?.templateId
                ? `${setUpTemplateRoute}/${initialTemplateId.templateId}`
                : dashboardRoute;

            router.push(routeToChange);
        }
    }, [authState.isAuthenticated]);

    const onSubmit = useCallback(
        handleSubmit((data: LoginUserParams) => {
            loginUserFx({
                email: data.email.trim().toLowerCase(),
                password: data.password,
            });
        }),
        [],
    );

    const handleResetEmailField = () => {
        reset();
        resetAuthErrorEvent();
    };

    const is480Media = useMediaQuery('(max-width:480px)');

    const passwordErrorMessages = useMemo(
        () =>
            errors?.password
                ?.filter((error: ValidationError) => error.message !== 'required')
                .map((error: Partial<ValidationError>) => (
                    <ErrorMessage key={error.message} error={`user.pass.${error.message}`} />
                )),
        [errors?.password],
    );

    const emailErrorMessages = useMemo(
        () =>
            errors.email
                ?.filter((error: ValidationError) => error.message !== 'required')
                .map((error: Partial<ValidationError>) => (
                    <ErrorMessage key={error.message} error={`${error.message}`} />
                )),
        [errors.email],
    );

    return (
        <>
            <CenteredPaper className={styles.wrapper}>
                <CustomGrid container alignItems="center" justifyContent="center">
                    <CustomBox className={styles.image}>
                        <Image
                            width="28"
                            height="28"
                            src="/images/winking-face.png"
                            alt="winking-face"
                        />
                    </CustomBox>
                    <CustomTypography
                        variant={is480Media ? 'h4' : 'h2bold'}
                        className={styles.text}
                        nameSpace="common"
                        translation="login.welcome"
                    />
                </CustomGrid>
                <FormProvider {...methods}>
                    <form className={styles.socialsWrapper} onSubmit={onSubmit}>
                        <CustomGrid container>
                            <CustomGrid item className={styles.input}>
                                <EmailInput
                                    onClear={handleResetEmailField}
                                    {...register('email')}
                                />
                                {errors?.email?.length && (
                                    <CustomGrid className={styles.errorContainer}>
                                        {emailErrorMessages}
                                    </CustomGrid>
                                )}
                            </CustomGrid>
                            <CustomGrid
                                container
                                direction="column"
                                alignItems="flex-end"
                                justifyContent="flex-end"
                                className={styles.input}
                            >
                                <PasswordInput {...register('password')} />
                                {errors?.password?.length && (
                                    <CustomGrid className={styles.errorContainer}>
                                        {passwordErrorMessages}
                                    </CustomGrid>
                                )}
                                <ForgotPassword className={styles.forgotPass} />
                            </CustomGrid>

                            {authState?.error?.message && (
                                <ErrorMessage
                                    className={styles.errorContainer}
                                    error={authState?.error?.message}
                                />
                            )}
                        </CustomGrid>

                        <CustomButton
                            className={styles.signInBtn}
                            disabled={!isCredentialsEntered}
                            type="submit"
                            nameSpace="common"
                            translation="buttons.login"
                        />
                    </form>
                </FormProvider>
            </CenteredPaper>
            <EmailResetPasswordDialog />
        </>
    );
};

export const SignInContainer = memo(Component);
