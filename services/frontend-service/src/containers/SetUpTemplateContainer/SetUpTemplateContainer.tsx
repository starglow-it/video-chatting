import { memo, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';
import * as yup from 'yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// components
import { SetUpTemplateInfo } from '@components/Templates/SetUpTemplateInfo/SetUpTemplateInfo';
import { TemplateGeneralInfo } from '@components/Templates/TemplateGeneralInfo/TemplateGeneralInfo';
import { LocalVideoPreview } from '@components/Meeting/LocalVideoPreview/LocalVideoPreview';
import { ConfirmQuitOnboardingDialog } from '@components/Dialogs/ConfirmQuitOnboardingDialog/ConfirmQuitOnboardingDialog';
import { SubscriptionsPlans } from '@components/Payments/SubscriptionsPlans/SubscriptionsPlans';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// store
import { dashboardRoute } from 'src/const/client-routes';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import {
    $setUpTemplateStore,
    $appDialogsStore,
    $profileAvatarImage,
    $routeToChangeStore,
    appDialogsApi,
    getTemplateFx,
    updateProfileFx,
    updateProfilePhotoFx,
    setRouteToChangeEvent,
    createMeetingFx,
    startCheckoutSessionForSubscriptionFx,
} from '../../store';

// styles
import styles from './SetUpTemplateContainer.module.scss';

// validations
import { companyNameSchema } from '../../validation/users/companyName';
import { fullNameSchema } from '../../validation/users/fullName';
import { simpleStringSchema } from '../../validation/common';

// types
import { AppDialogsEnum } from '../../store/types';

// utils
import { getClientMeetingUrl } from '../../utils/urls';

const validationSchema = yup.object({
    companyName: companyNameSchema().required('required'),
    fullName: fullNameSchema().required('required'),
    signBoard: simpleStringSchema().required('required'),
});

const Component = () => {
    const router = useRouter();

    const setUpTemplate = useStore($setUpTemplateStore);
    const profileAvatar = useStore($profileAvatarImage);
    const { confirmQuitOnboardingDialog } = useStore($appDialogsStore);
    const routeToChange = useStore($routeToChangeStore);

    const isCreateMeetingPending = useStore(createMeetingFx.pending);
    const isSubscriptionPurchasePending = useStore(
        startCheckoutSessionForSubscriptionFx.pending,
    );

    const forceRef = useRef<boolean>(false);
    const isDataFilled = useRef<boolean>(false);

    const { value: isProfileUpdated } = useToggle(false);

    useEffect(() => {
        if (router.query.templateId) {
            (async () => {
                await getTemplateFx({
                    templateId: router.query.templateId as string,
                });
            })();
        }

        return () => {
            appDialogsApi.closeDialog({
                dialogKey: AppDialogsEnum.confirmQuitOnboardingDialog,
            });
        };
    }, []);

    const resolver = useYupValidationResolver<{
        companyName: string;
        fullName: string;
        signBoard: string;
    }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            companyName: '',
            fullName: '',
            signBoard: 'default',
        },
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitSuccessful },
    } = methods;

    const companyName = useWatch({
        control,
        name: 'companyName',
    });

    const fullName = useWatch({
        control,
        name: 'fullName',
    });

    const signBoard = useWatch({
        control,
        name: 'signBoard',
    });

    useEffect(() => {
        isDataFilled.current = Boolean(fullName) && Boolean(companyName);
    }, [fullName && companyName]);

    const onSubmit = useCallback(
        handleSubmit(async data => {
            if (setUpTemplate?.id) {
                if (profileAvatar.file) {
                    await updateProfilePhotoFx({ file: profileAvatar.file });
                }

                await updateProfileFx({
                    ...data,
                    registerTemplate: null,
                });

                const result = await createMeetingFx({
                    templateId: setUpTemplate.id,
                });

                const meetingUrl = getClientMeetingUrl(
                    result?.template?.id || '',
                );
                await router.push(`${meetingUrl}?success_house=true`);
            }
            if (!router.query.templateId) {
                await updateProfileFx({
                    ...data,
                });
                if (profileAvatar.file) {
                    await updateProfilePhotoFx({ file: profileAvatar.file });
                }
                await router.push(dashboardRoute);
            }
        }),
        [profileAvatar.file, setUpTemplate?.id],
    );

    const handleChangeRoute = (route: string) => {
        if (!isDataFilled.current) {
            if (router.asPath !== route && !forceRef.current) {
                router.events.emit('routeChangeError');
                setRouteToChangeEvent(route);

                appDialogsApi.openDialog({
                    dialogKey: AppDialogsEnum.confirmQuitOnboardingDialog,
                });

                throw new Error('routeChange aborted');
            }
        }
    };

    const handleQuit = useCallback(async () => {
        forceRef.current = true;
        await router.push(routeToChange);

        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmQuitOnboardingDialog,
        });
    }, [routeToChange]);

    const handleCancel = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmQuitOnboardingDialog,
        });
    }, []);

    useEffect(() => {
        router.events.on('routeChangeStart', handleChangeRoute);

        return () => {
            router.events.off('routeChangeStart', handleChangeRoute);
        };
    }, [confirmQuitOnboardingDialog]);

    const handleChooseSubscription = async (
        productId: string,
        isPaid: boolean,
        trial: boolean,
    ) => {
        if (setUpTemplate?.id) {
            updateProfileFx({
                registerTemplate: null,
            });
            const result = await createMeetingFx({
                templateId: setUpTemplate.id,
            });

            if (result.template && isPaid) {
                const response = await startCheckoutSessionForSubscriptionFx({
                    productId,
                    meetingToken: result.template.id,
                    withTrial: trial,
                });

                if (response?.url) {
                    return router.push(response.url);
                }
            } else if (result.template) {
                const meetingUrl = getClientMeetingUrl(result.template.id);
                await router.push(`${meetingUrl}?success_house=true`);
            }
        }
    };

    const previewImage = (setUpTemplate?.previewUrls || []).find(
        preview => preview.resolution === 1080,
    );

    return (
        <CustomGrid
            container
            justifyContent="flex-end"
            className={styles.wrapper}
        >
            {previewImage?.url && (
                <CustomGrid container className={styles.imageWrapper}>
                    <CustomImage
                        src={previewImage?.url}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                    />
                </CustomGrid>
            )}
            <ConditionalRender condition={!previewImage?.url}>
                <CustomGrid container bgcolor="#fcfcfc" />
            </ConditionalRender>
            <FormProvider {...methods}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <TemplateGeneralInfo
                        signBoard={signBoard}
                        profileAvatar={profileAvatar.dataUrl}
                        companyName={companyName}
                        userName={fullName}
                    />
                    <LocalVideoPreview />
                    {!isSubmitSuccessful && <SetUpTemplateInfo />}
                    <SubscriptionsPlans
                        isSubscriptionStep={isProfileUpdated}
                        isDisabled={
                            isCreateMeetingPending ||
                            isSubscriptionPurchasePending
                        }
                        onChooseSubscription={handleChooseSubscription}
                    />
                </form>
            </FormProvider>
            <ConfirmQuitOnboardingDialog
                onConfirm={handleQuit}
                onCancel={handleCancel}
            />
        </CustomGrid>
    );
};

export const SetUpTemplateContainer = memo(Component);
