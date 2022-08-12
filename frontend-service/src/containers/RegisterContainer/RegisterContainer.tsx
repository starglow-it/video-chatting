import React, { memo, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import * as yup from 'yup';
import Image from 'next/image';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import { useForm, useWatch, FormProvider } from 'react-hook-form';
import { useMediaQuery } from '@mui/material';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// icons
// import { GoogleIcon } from '@library/icons/GoogleIcon';
// import { LinkedInIcon } from '@library/icons/LinkedInIcon';
// import { SocialLogin } from '@library/common/SocialLogin/SocialLogin';
// import { BlockSeparator } from '@library/common/BlockSeparator/BlockSeparator';

// custom
import { CustomCheckbox } from '@library/custom/CustomCheckbox/CustomCheckbox';
import { CustomLink } from '@library/custom/CustomLink/CustomLink';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

import { PasswordInput } from '@library/common/PasswordInput/PasswordInput';
import { EmailInput } from '@library/common/EmailInput/EmailInput';
import { PasswordHints } from '@library/common/PasswordHints/PasswordHints';
import { CenteredPaper } from '@library/common/CenteredPaper/CenteredPaper';
import { SuccessfulRegisterDialog } from '@components/Dialogs/SuccessfulRegisterDialog/SuccessfulRegisterDialog';

// stores
import { RegisterUserParams } from 'src/store/types';
import { $registerStore, registerUserFx, resetRegisterErrorEvent } from '../../store';

// types

// styles
import styles from './RegisterContainer.module.scss';

// validations
import { emailSchema } from '../../validation/users/email';
import { passwordSchema } from '../../validation/users/password';

const validationSchema = yup.object({
    email: emailSchema().required('required'),
    password: passwordSchema().required('required'),
    terms: yup.boolean().required(),
});

const RegisterContainer = memo(() => {
    const router = useRouter();
    const { error } = useStore($registerStore);

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

    const onSubmit = handleSubmit(async (data: RegisterUserParams) => {
        resetRegisterErrorEvent();
        await registerUserFx({ email: data.email.trim().toLowerCase(), password: data.password });
    });

    useEffect(() => {
        if (!showHints) {
            reset({}, { keepValues: true });
        }
    }, [showHints]);

    const handleResetEmailField = useCallback(() => {
        reset({
            email: '',
            password: '',
            terms: true,
        });
        resetRegisterErrorEvent();
        setHints(false);
    }, []);

    const handleCloseRegister = useCallback(async () => {
        await router.push('/');
    }, []);

    const handleFocusInput = useCallback(() => {
        setHints(true);
    }, []);

    const handleBlurInput = useCallback(() => {
        setHints(false);
    }, []);

    const is480Media = useMediaQuery('(max-width:480px)');

    const currentEmailErrorMessage: string = errors?.email?.[0]?.message || error?.message || '';

    const isNotRequiredMessage = !currentEmailErrorMessage.includes('required');

    return (
        <>
            <CenteredPaper className={styles.wrapper}>
                <CustomGrid container alignItems="center" justifyContent="center">
                    <CustomBox className={styles.image}>
                        <Image width="28" height="28" src="/images/hi-hand.png" alt="hi-hand" />
                    </CustomBox>
                    <CustomTypography
                        variant="h2bold"
                        className={styles.text}
                        nameSpace="register"
                        translation="getStarted.title"
                    />
                </CustomGrid>
                {/* <CustomGrid container direction="column" className={styles.socialsWrapper}>
                <CustomGrid item className={styles.googleLogin}>
                    <SocialLogin
                        Icon={GoogleIcon}
                        nameSpace="register"
                        translation={`getStarted.socialLogin.google${is480Media ? 'Mobile' : ''}`}
                    />
                </CustomGrid>
                <CustomGrid item>
                    <SocialLogin
                        Icon={LinkedInIcon}
                        nameSpace="register"
                        translation={`getStarted.socialLogin.linkedIn${is480Media ? 'Mobile' : ''}`}
                    />
                </CustomGrid>
            </CustomGrid>
            <BlockSeparator
                className={styles.createAccountSeparator}
                nameSpace="register"
                translation="getStarted.createNewAcc"
            /> */}
                <FormProvider {...methods}>
                    <form className={styles.socialsWrapper} onSubmit={onSubmit}>
                        <CustomGrid container>
                            <CustomGrid item className={styles.input}>
                                <EmailInput
                                    error={isNotRequiredMessage ? currentEmailErrorMessage : ''}
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
                                <PasswordHints show={showHints} fieldKey="password" />
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
                                            className={clsx(styles.termsText, styles.termsLink)}
                                            href="/terms"
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
                                            className={clsx(styles.termsText, styles.termsLink)}
                                            href="/privacy"
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
                            type="submit"
                            nameSpace="register"
                            translation="getStarted.button"
                        />
                    </form>
                </FormProvider>
            </CenteredPaper>
            <SuccessfulRegisterDialog />
        </>
    );
});

export { RegisterContainer };
