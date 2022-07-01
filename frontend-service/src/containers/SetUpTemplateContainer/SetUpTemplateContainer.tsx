import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useStore } from 'effector-react';
import * as yup from 'yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { SetUpTemplateInfo } from '@components/Templates/SetUpTemplateInfo/SetUpTemplateInfo';
import { TemplateGeneralInfo } from '@components/Templates/TemplateGeneralInfo/TemplateGeneralInfo';
import { LocalVideoPreview } from '@components/Meeting/LocalVideoPreview/LocalVideoPreview';
import { ConfirmQuitOnboardingDialog } from '@components/Dialogs/ConfirmQuitOnboardingDialog/ConfirmQuitOnboardingDialog';

// store
import {
    $setUpTemplateStore,
    $appDialogsStore,
    $profileAvatarImage,
    $routeToChangeStore,
    appDialogsApi,
    getTemplateFx,
    updateProfileFx,
    updateProfilePhotoFx,
    createMeetingFx,
    setRouteToChangeEvent
} from '../../store';

// styles
import styles from './SetUpTemplateContainer.module.scss';

// validations
import { useYupValidationResolver } from '../../hooks/useYupValidationResolver';
import { companyNameSchema } from '../../validation/users/companyName';
import { fullNameSchema } from '../../validation/users/fullName';
import { simpleStringSchema } from '../../validation/common';

// utils
import { StorageKeysEnum, WebStorage } from '../../controllers/WebStorageController';

// types
import { AppDialogsEnum } from '../../store/types';

const validationSchema = yup.object({
    companyName: companyNameSchema().required('required'),
    fullName: fullNameSchema().required('required'),
    signBoard: simpleStringSchema().required('required'),
});

const SetUpTemplateContainer = memo(() => {
    const router = useRouter();

    const setUpTemplate = useStore($setUpTemplateStore);
    const profileAvatar = useStore($profileAvatarImage);
    const { confirmQuitOnboardingDialog } = useStore($appDialogsStore);
    const routeToChange = useStore($routeToChangeStore);

    const forceRef = useRef<boolean>(false);
    const isDataFilled = useRef<boolean>(false);

    useEffect(() => {
        (async () => {
            await getTemplateFx({ templateId: router.query.templateId as string });
        })();

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
            signBoard: '',
        },
    });

    const { handleSubmit, control } = methods;

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
        isDataFilled.current = fullName && companyName;
    }, [fullName && companyName]);

    const onSubmit = useCallback(
        handleSubmit(async data => {
            if (profileAvatar.file) {
                await updateProfilePhotoFx({ file: profileAvatar.file });
            }

            await updateProfileFx(data);

            const result = await createMeetingFx({ templateId: setUpTemplate?.id! });

            if (result.meeting) {
                WebStorage.delete({ key: StorageKeysEnum.templateId });

                await router.push(`/meeting/${result.meeting.id}`);
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

                throw 'routeChange aborted';
            }
        }
    };

    const handleQuit = useCallback(async () => {
        forceRef.current = true;
        await router.push(routeToChange);

        WebStorage.delete({ key: StorageKeysEnum.templateId });

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

    return (
        <CustomGrid container justifyContent="flex-end" className={styles.wrapper}>
            {setUpTemplate?.previewUrl && (
                <CustomGrid container className={styles.imageWrapper}>
                    <Image src={setUpTemplate?.previewUrl || ''} layout="fill" />
                </CustomGrid>
            )}
            <FormProvider {...methods}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <TemplateGeneralInfo
                        signBoard={signBoard}
                        profileAvatar={profileAvatar.dataUrl}
                        companyName={companyName}
                        userName={fullName}
                    />
                    <LocalVideoPreview />
                    <SetUpTemplateInfo />
                </form>
            </FormProvider>
            <ConfirmQuitOnboardingDialog onConfirm={handleQuit} onCancel={handleCancel} />
        </CustomGrid>
    );
});

export { SetUpTemplateContainer };
