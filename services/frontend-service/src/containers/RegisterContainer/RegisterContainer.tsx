import { memo, useCallback, useEffect, useState } from 'react';
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

// styles

// validations
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomCheckbox } from 'shared-frontend/library/custom/CustomCheckbox';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { SignInGoogle } from '@components/SignIn/SignInGoogle/SignInGoogle';
import { useRouter } from 'next/router';
import { dashboardRoute } from 'src/const/client-routes';
import { RegisterType } from 'shared-types';
import {
    StorageKeysEnum,
    WebStorage,
} from '../../controllers/WebStorageController';
import { passwordSchema } from '../../validation/users/password';
import { emailSchema } from '../../validation/users/email';
import styles from './RegisterContainer.module.scss';
import {
    $authStore,
    $registerStore,
    googleVerifyFx,
    registerUserFx,
    resetRegisterErrorEvent,
} from '../../store';

const validationSchema = yup.object({
    email: emailSchema().required('required'),
    password: passwordSchema().required('required'),
    terms: yup.boolean().required(),
});

const Component = () => {
    const router = useRouter();
    const { error } = useStore($registerStore);
    const authState = useStore($authStore);
    const isVerifying = useStore(googleVerifyFx.pending);

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
        const initialTemplateData = WebStorage.get<{ templateId: string }>({
            key: StorageKeysEnum.templateId,
        });

        resetRegisterErrorEvent();

        registerUserFx({
            email: data.email.trim().toLowerCase(),
            password: data.password,
            templateId: initialTemplateData.templateId,
            registerType: RegisterType.Default,
        });
    });

    useEffect(() => {
        (async () => {
            if (authState.isAuthenticated && !isVerifying) {
                router.push(dashboardRoute);
            }
        })();
    }, [authState.isAuthenticated, isVerifying]);

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
        <CustomGrid
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <CustomGrid className={styles.background}>
                <CustomImage
                    src="/images/background-register.png"
                    className={styles.wrapperBackgroundMedia}
                    layout="fill"
                />
            </CustomGrid>
            <CenteredPaper className={styles.outterWrapper}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    className={styles.titleWrapper}
                >
                    <CustomTypography
                        variant="h2"
                        className={styles.text1}
                        nameSpace="register"
                        translation="getStarted.title1"
                    />
                    <CustomTypography
                        variant="h2bold"
                        className={styles.textBold}
                        nameSpace="register"
                        translation="getStarted.title2"
                    />
                    <CustomBox className={styles.image}>
                        <CustomImage
                            width="35"
                            height="35"
                            src="/images/happy-face.png"
                            alt="happy-face"
                        />
                    </CustomBox>
                </CustomGrid>
                <CustomGrid
                    item
                    container
                    flex-direction="column"
                    alignItems="center"
                    justifyContent="center"
                    className={styles.innerWrapper}
                >
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
                                        translation="getStarted.button"
                                    />
                                }
                                type="submit"
                            />
                        </form>
                    </FormProvider>
                </CustomGrid>
                <CustomBox className={styles.ruumeLogo}>
                    <CustomImage
                        width="150"
                        height="45"
                        src="/images/ruumeWhite.png"
                        alt="ruume logo white"
                    />
                </CustomBox>
            </CenteredPaper>
            <SuccessfulRegisterDialog />
        </CustomGrid>
    );
};

export const RegisterContainer = memo(Component);
