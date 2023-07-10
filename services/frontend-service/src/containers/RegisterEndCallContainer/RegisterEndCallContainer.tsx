import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import * as yup from 'yup';
import { useStore } from 'effector-react';
import { useForm, useWatch, FormProvider } from 'react-hook-form';
import { useMediaQuery } from '@mui/material';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomLink } from '@library/custom/CustomLink/CustomLink';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// common
import { PasswordInput } from '@library/common/PasswordInput/PasswordInput';
import { EmailInput } from '@library/common/EmailInput/EmailInput';
import { PasswordHints } from '@library/common/PasswordHints/PasswordHints';
import { CenteredPaper } from 'shared-frontend/library/common/CenteredPaper';

// dialogs
import { SuccessfulRegisterDialog } from '@components/Dialogs/SuccessfulRegisterDialog/SuccessfulRegisterDialog';

// stores
import { RegisterUserParams } from 'src/store/types';
import { Translation } from '@library/common/Translation/Translation';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomCheckbox } from 'shared-frontend/library/custom/CustomCheckbox';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { MeetingBackgroundVideo } from '@components/Meeting/MeetingBackgroundVideo/MeetingBackgroundVideo';
import { LiveOfficeLogo } from 'shared-frontend/icons/OtherIcons/LiveOfficeLogo';
import { SignInGoogle } from '@components/SignIn/SignInGoogle/SignInGoogle';
import { useRouter } from 'next/router';
import { dashboardRoute } from 'src/const/client-routes';
import {
    $authStore,
    $registerStore,
    registerWithoutTemplateFx,
    resetRegisterErrorEvent,
} from '../../store';

// styles
import styles from './RegisterEndCallContainer.module.scss';

// validations
import { emailSchema } from '../../validation/users/email';
import { passwordSchema } from '../../validation/users/password';
import {
    StorageKeysEnum,
    WebStorage,
} from '../../controllers/WebStorageController';

const validationSchema = yup.object({
    email: emailSchema().required('required'),
    password: passwordSchema().required('required'),
    terms: yup.boolean().required(),
});

const Component = () => {
    const { error } = useStore($registerStore);
    const router = useRouter();
    const authState = useStore($authStore);
    const [showHints, setHints] = useState<boolean>(false);

    const resolver = useYupValidationResolver<{
        email: string;
        password: string;
        terms: boolean;
    }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
    });

    const {
        control,
        handleSubmit,
        reset,
        register,
        formState: { errors },
    } = methods;

    const isTermsAccepted = useWatch({ control, name: 'terms' });

    const lastTemplate = useMemo(() => {
        return WebStorage.get<{ templateType: string; templateUrl: string }>({
            key: StorageKeysEnum.bgLastCall,
        });
    }, []);

    const onSubmit = handleSubmit(async (data: RegisterUserParams) => {
        resetRegisterErrorEvent();

        registerWithoutTemplateFx({
            email: data.email.trim().toLowerCase(),
            password: data.password,
        });
    });

    useEffect(() => {
        if (authState.isAuthenticated) {
            router.push(dashboardRoute);
        }
    }, [authState.isAuthenticated]);

    useEffect(() => {
        if (!showHints) {
            reset({}, { keepValues: true });
        }
    }, [showHints]);

    const handleResetEmailField = useCallback(() => {
        reset({
            email: '',
            password: '',
            terms: false,
        });
        resetRegisterErrorEvent();
        setHints(false);
    }, []);

    const handleFocusInput = useCallback(() => {
        setHints(true);
    }, []);

    const handleBlurInput = useCallback(() => {
        setHints(false);
    }, []);

    const is480Media = useMediaQuery('(max-width:480px)');

    const currentEmailErrorMessage: string =
        errors?.email?.[0]?.message || error?.message || '';

    const isNotRequiredMessage = !currentEmailErrorMessage.includes('required');

    return (
        <>
            <MeetingBackgroundVideo
                templateType={lastTemplate?.templateType}
                src={lastTemplate?.templateUrl}
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
                >
                    <CustomImage
                        src="/images/Ruume.svg"
                        width="150px"
                        height="35px"
                    />
                    <CustomTypography
                        variant="h2bold"
                        className={styles.text}
                        nameSpace="register"
                        translation="signUpEndCall.title"
                    />
                </CustomGrid>
                <CustomGrid
                    justifyContent="center"
                    alignItems="center"
                    container
                >
                    <CustomImage
                        width="28"
                        height="28"
                        src="/images/winking-face.webp"
                        alt="hi-hand"
                    />
                </CustomGrid>
                <SignInGoogle buttonText="buttons.registerGoogle" />
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
                                    error={
                                        isNotRequiredMessage
                                            ? currentEmailErrorMessage
                                            : ''
                                    }
                                    onClear={handleResetEmailField}
                                    {...register('email')}
                                />
                            </CustomGrid>
                            <CustomGrid item className={styles.input}>
                                <PasswordInput
                                    fieldKey="password"
                                    onFocus={handleFocusInput}
                                    {...register('password')}
                                    onCustomBlur={handleBlurInput}
                                />
                                <PasswordHints
                                    show={showHints}
                                    fieldKey="password"
                                />
                            </CustomGrid>
                        </CustomGrid>

                        <CustomGrid
                            container
                            flexWrap="nowrap"
                            justifyContent="center"
                            alignItems="center"
                            className={styles.termsWrapper}
                        >
                            <CustomCheckbox
                                className={styles.checkbox}
                                labelClassName={styles.label}
                                label={
                                    <CustomGrid>
                                        {!is480Media && (
                                            <CustomTypography
                                                className={styles.termsText}
                                                variant="body2"
                                                nameSpace="common"
                                                translation="iAgree"
                                            />
                                        )}
                                        <CustomLink
                                            className={clsx(
                                                styles.termsText,
                                                styles.termsLink,
                                            )}
                                            href="/agreements"
                                            variant="body2"
                                            nameSpace="common"
                                            translation="terms"
                                        />
                                        {!is480Media && (
                                            <CustomTypography
                                                className={styles.termsText}
                                                variant="body2"
                                                nameSpace="common"
                                                translation="and"
                                            />
                                        )}
                                        <CustomLink
                                            className={clsx(
                                                styles.termsText,
                                                styles.termsLink,
                                            )}
                                            href="/agreements?section=privacy"
                                            variant="body2"
                                            nameSpace="common"
                                            translation="privacy"
                                        />
                                    </CustomGrid>
                                }
                                {...register('terms')}
                            />
                        </CustomGrid>

                        <CustomButton
                            className={styles.registerButton}
                            disabled={!isTermsAccepted}
                            label={
                                <Translation
                                    nameSpace="register"
                                    translation="signUpEndCall.button"
                                />
                            }
                            type="submit"
                        />
                    </form>
                </FormProvider>
            </CenteredPaper>
            <SuccessfulRegisterDialog />
        </>
    );
};

export default memo(Component);
