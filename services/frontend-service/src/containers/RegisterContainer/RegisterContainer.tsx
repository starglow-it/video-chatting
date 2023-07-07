import React, { memo, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import * as yup from 'yup';
import { useStore, useStoreMap } from 'effector-react';
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
import { getClientMeetingUrl } from 'src/utils/urls';
import { useRouter } from 'next/router';
import { EntityList, IUserTemplate } from 'shared-types';
import { dashboardRoute } from 'src/const/client-routes';
import {
    StorageKeysEnum,
    WebStorage,
} from '../../controllers/WebStorageController';
import { passwordSchema } from '../../validation/users/password';
import { emailSchema } from '../../validation/users/email';
import styles from './RegisterContainer.module.scss';
import {
    $authStore,
    $profileStore,
    $profileTemplatesCountStore,
    $profileTemplatesStore,
    $registerStore,
    createMeetingFx,
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
    const profile = useStore($profileStore);
    const { state: profileTemplatesCount } = useStore(
        $profileTemplatesCountStore,
    );
    const freeTemplates = useStoreMap<
        EntityList<IUserTemplate>,
        IUserTemplate[],
        [string]
    >({
        store: $profileTemplatesStore,
        keys: [profile.id],
        fn: (state, [profileId]) =>
            state?.list.filter(
                template =>
                    template.type === 'free' && template.author !== profileId,
            ),
    });

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
        });
    });

    useEffect(() => {
        (async () => {
            if (authState.isAuthenticated && !isVerifying) {
                if (authState.isFirstLogin) {
                    const initialTemplateData = WebStorage.get<{
                        templateId: string;
                    }>({
                        key: StorageKeysEnum.templateId,
                    });
                    const result = await createMeetingFx({
                        templateId: initialTemplateData.templateId,
                    });

                    const meetingUrl = getClientMeetingUrl(
                        result?.template?.id || '',
                    );
                    await router.push(`${meetingUrl}?success_house=true`);
                } else {
                    router.push(dashboardRoute);
                }
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
        <>
            <CenteredPaper className={styles.wrapper}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                >
                    <CustomBox className={styles.image}>
                        <CustomImage
                            width="28"
                            height="28"
                            src="/images/hi-hand.webp"
                            alt="hi-hand"
                        />
                    </CustomBox>
                    <CustomTypography
                        variant="h2bold"
                        className={styles.text}
                        nameSpace="register"
                        translation="getStarted.title"
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
                                    translation="getStarted.button"
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

export const RegisterContainer = memo(Component);
