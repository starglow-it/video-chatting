import { memo, useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';
import { ValidationError } from 'yup';
import * as yup from 'yup';
import { useMediaQuery } from '@mui/material';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';

// common
import { EmailInput } from '@library/common/EmailInput/EmailInput';
import { PasswordInput } from '@library/common/PasswordInput/PasswordInput';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';
import { CenteredPaper } from 'shared-frontend/library/common/CenteredPaper';

// components
import { ForgotPassword } from '@components/ForgotPassword/ForgotPassword';
import { EmailResetPasswordDialog } from '@components/Dialogs/EmailResetPasswordDialog/EmailResetPasswordDialog';
import { UserBlockedDialog } from '@components/Dialogs/UserBlockedDialog/UserBlockedDialog';
import { SignInGoogle } from '@components/SignIn/SignInGoogle/SignInGoogle';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// styles
import { Translation } from '@library/common/Translation/Translation';
import { useRouter } from 'next/router';
import { USER_IS_BLOCKED } from 'shared-const';
import {
    StorageKeysEnum,
    WebStorage,
} from 'src/controllers/WebStorageController';
import { MeetingBackgroundVideo } from '@components/Meeting/MeetingBackgroundVideo/MeetingBackgroundVideo';
import styles from './SignInContainer.module.scss';

// stores
import {
    $authStore,
    googleVerifyFx,
    loginUserFx,
    resetAuthErrorEvent,
} from '../../store';

// types
import { LoginUserParams } from '../../store/types';

import { dashboardRoute } from '../../const/client-routes';

// validations
import { emailSchema } from '../../validation/users/email';
import { passwordLoginSchema } from '../../validation/users/password';

const validationSchema = yup.object({
    email: emailSchema().required('required'),
    password: passwordLoginSchema().required('required'),
});

const Component = () => {
    const router = useRouter();

    const authState = useStore($authStore);
    const isLoginPending = useStore(
        loginUserFx.pending || googleVerifyFx.pending,
    );

    const resolver = useYupValidationResolver<{
        email: string;
        password: string;
    }>(validationSchema);

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

    const lastTemplate = useMemo(() => {
        return WebStorage.get<{ templateType: string; templateUrl: string }>({
            key: StorageKeysEnum.bgLastCall,
        });
    }, []);

    useEffect(() => {
        if (authState.isAuthenticated) {
            router.push(dashboardRoute);
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
                ?.filter(
                    (error: ValidationError) => error.message !== 'required',
                )
                .map((error: Partial<ValidationError>) => (
                    <ErrorMessage
                        key={error.message}
                        error={`user.pass.${error.message}`}
                    />
                )),
        [errors?.password],
    );

    const emailErrorMessages = useMemo(
        () =>
            errors.email
                ?.filter(
                    (error: ValidationError) => error.message !== 'required',
                )
                .map((error: Partial<ValidationError>) => (
                    <ErrorMessage
                        key={error.message}
                        error={`${error.message}`}
                    />
                )),
        [errors.email],
    );

    return (
        <>
            <MeetingBackgroundVideo
                templateType={lastTemplate?.templateType}
                src={lastTemplate?.templateUrl}
                videoClassName={styles.bgContainer}
            >
                <CustomImage
                    className={styles.image}
                    src={lastTemplate?.templateUrl || ''}
                    width="100%"
                    height="100%"
                    layout="fill"
                    objectFit="cover"
                />
            </MeetingBackgroundVideo>
            <CenteredPaper className={styles.wrapper}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    marginBottom="10px"
                >
                    <CustomImage
                        src="/images/Ruume.svg"
                        width="150px"
                        height="35px"
                    />
                </CustomGrid>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                >
                    <CustomBox className={styles.image}>
                        <CustomImage
                            width="28"
                            height="28"
                            src="/images/winking-face.webp"
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
                <SignInGoogle />
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    marginTop="18px"
                >
                    <CustomTypography
                        className={styles.textOr}
                        nameSpace="register"
                        translation="signUpEndCall.or"
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
                                    <CustomGrid
                                        className={styles.errorContainer}
                                    >
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
                                    <CustomGrid
                                        className={styles.errorContainer}
                                    >
                                        {passwordErrorMessages}
                                    </CustomGrid>
                                )}
                                <ForgotPassword className={styles.forgotPass} />
                            </CustomGrid>

                            {authState?.error?.message &&
                                authState?.error?.message !==
                                    USER_IS_BLOCKED.message && (
                                    <ErrorMessage
                                        className={styles.errorContainer}
                                        error={authState?.error?.message}
                                    />
                                )}
                        </CustomGrid>

                        <CustomButton
                            className={styles.signInBtn}
                            disabled={!isCredentialsEntered || isLoginPending}
                            label={
                                <Translation
                                    nameSpace="common"
                                    translation="buttons.login"
                                />
                            }
                            type="submit"
                        />
                    </form>
                </FormProvider>
            </CenteredPaper>
            <EmailResetPasswordDialog />
            <UserBlockedDialog />
        </>
    );
};

export default memo(Component);
