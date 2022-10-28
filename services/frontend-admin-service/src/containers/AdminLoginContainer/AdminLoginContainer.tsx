import React, { memo, useCallback, useMemo } from 'react';
import { useStore } from 'effector-react';
import { useMediaQuery } from '@mui/material';
import { ValidationError } from 'yup';
import * as yup from 'yup';
import { useForm, useWatch, FormProvider } from 'react-hook-form';

// shared
import { emailSchema, passwordLoginSchema } from 'shared-frontend/validation';
import {
    ErrorMessage,
    EmailInput,
    CenteredPaper,
    CustomGrid,
    CustomBox,
    CustomImage,
    CustomTypography,
    PasswordInput,
    CustomButton,
    ConditionalRender,
} from 'shared-frontend/library';
import { useYupValidationResolver } from 'shared-frontend/hooks';

// components
import { Translation } from '@components/Translation/Translation';

// stores
import { $authStore, loginAdminFx, resetAuthErrorEvent } from '../../store';

// styles
import styles from './AdminLoginContainer.module.scss';

const validationSchema = yup.object({
    email: emailSchema().required('required'),
    password: passwordLoginSchema().required('required'),
});

const defaultFormValues = {
    email: '',
    password: '',
};

type LoginAdminFormData = { email: string; password: string };

const Component = () => {
    const { error: authStateError } = useStore($authStore);

    const resolver = useYupValidationResolver<LoginAdminFormData>(validationSchema);

    const methods = useForm({
        resolver,
        defaultValues: defaultFormValues,
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

    const onSubmit = useCallback(
        handleSubmit((data: LoginAdminFormData) => {
            loginAdminFx({
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
                    <ErrorMessage key={error.message} error>
                        <Translation
                            nameSpace="errors"
                            translation={`user.pass.${error.message}`}
                        />
                    </ErrorMessage>
                )),
        [errors?.password],
    );

    const emailErrorMessages = useMemo(
        () =>
            errors.email
                ?.filter((error: ValidationError) => error.message !== 'required')
                .map((error: Partial<ValidationError>) => (
                    <ErrorMessage key={error.message} error>
                        <Translation nameSpace="errors" translation={`${error.message}`} />
                    </ErrorMessage>
                )),
        [errors.email],
    );

    const registerEmailData = useMemo(() => register('email'), []);
    const registerPasswordData = useMemo(() => register('password'), []);

    return (
        <CenteredPaper className={styles.wrapper}>
            <CustomGrid container alignItems="center" justifyContent="center">
                <CustomBox className={styles.image}>
                    <CustomImage
                        width="28"
                        height="28"
                        src="/images/winking-face.png"
                        alt="winking-face"
                    />
                </CustomBox>
                <CustomTypography variant={is480Media ? 'h4' : 'h2bold'} className={styles.text}>
                    <Translation nameSpace="common" translation="signIn.label" />
                </CustomTypography>
            </CustomGrid>
            <FormProvider {...methods}>
                <form className={styles.socialsWrapper} onSubmit={onSubmit}>
                    <CustomGrid container>
                        <CustomGrid item className={styles.input}>
                            <EmailInput
                                onClear={handleResetEmailField}
                                label={<Translation nameSpace="forms" translation="email" />}
                                error={errors?.email?.length}
                                {...registerEmailData}
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
                            <PasswordInput
                                label={<Translation nameSpace="forms" translation="password" />}
                                error={errors?.password?.length}
                                value={password}
                                {...registerPasswordData}
                            />
                            {errors?.password?.length && (
                                <CustomGrid className={styles.errorContainer}>
                                    {passwordErrorMessages}
                                </CustomGrid>
                            )}
                        </CustomGrid>

                        <ConditionalRender condition={Boolean(authStateError?.message)}>
                            <ErrorMessage
                                className={styles.errorContainer}
                                error={Boolean(authStateError?.message)}
                            >
                                <Translation
                                    nameSpace="errors"
                                    translation={authStateError?.message}
                                />
                            </ErrorMessage>
                        </ConditionalRender>
                    </CustomGrid>

                    <CustomButton
                        className={styles.signInBtn}
                        disabled={!isCredentialsEntered}
                        type="submit"
                        label={<Translation nameSpace="common" translation="buttons.signIn" />}
                    />
                </form>
            </FormProvider>
        </CenteredPaper>
    );
};

export const AdminLoginContainer = memo(Component);
