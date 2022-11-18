import React, { memo, useCallback, useMemo, useRef } from 'react';
import { useStore } from 'effector-react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useRouter } from 'next/router';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { MainProfileWrapper } from '@library/common/MainProfileWrapper/MainProfileWrapper';
import { EditAccountInfo } from '@components/Profile/EditAccountInfo/EditAccountInfo';
import { EditCompanyInfo } from '@components/Profile/EditCompanyInfo/EditCompanyInfo';
import { EditPersonalInfo } from '@components/Profile/EditPersonalInfo/EditPersonalInfo';
import { EditSocialInfo } from '@components/Profile/EditSocialInfo/EditSocialInfo';
import { SubmitProfileInfo } from '@components/Profile/SubmitProfileInfo/SubmitProfileInfo';
import { ConfirmChangeRouteDialog } from '@components/Dialogs/ConfirmChangeRouteDialog/ConfirmChangeRouteDialog';
import { DeleteProfileDialog } from '@components/Dialogs/DeleteProfileDialog/DeleteProfileDialog';
import { DeleteProfile } from '@components/Profile/DeleteProfile/DeleteProfile';

// shared
import { CustomImage } from 'shared-frontend/library';

// stores
import {IBusinessCategory, ILanguage, ISocialLink} from 'shared-types';
import { $profileStore, $routeToChangeStore, appDialogsApi, updateProfileFx } from '../../store';

// validations
import { companyNameSchema } from '../../validation/users/companyName';
import { emailSchema } from '../../validation/users/email';
import { simpleStringSchema, simpleStringSchemaWithLength } from '../../validation/common';
import { businessCategoriesSchema } from '../../validation/users/businessCategories';
import { languagesSchema } from '../../validation/users/languagesSchema';
import { fullNameSchema } from '../../validation/users/fullName';
import { validateSocialLink } from '../../validation/users/socials';

// styles
import styles from './EditProfileContainer.module.scss';

// types
import { AppDialogsEnum } from '../../store/types';

const validationSchema = yup.object({
    companyName: companyNameSchema().required('required'),
    contactEmail: emailSchema(),
    fullName: fullNameSchema().required('required'),
    position: simpleStringSchema(),
    description: simpleStringSchemaWithLength(300),
    businessCategories: businessCategoriesSchema(),
    languages: languagesSchema(),
    socials: yup.array().of(validateSocialLink()),
});

const EditProfileContainer = memo(() => {
    const router = useRouter();

    const popperRef = useRef<HTMLDivElement | null>(null);

    const profile = useStore($profileStore);
    const routeToChange = useStore($routeToChangeStore);

    const resolver = useYupValidationResolver<{
        companyName: string;
        contactEmail: string;
        description: string;
        businessCategories: IBusinessCategory['key'][];
        languages: ILanguage['key'][];
        fullName: string;
        position: string;
        socials: { key: string; value: string }[];
    }>(validationSchema);

    const profileLinks = useMemo<{ key: string; value: string }[]>(
        () => profile.socials.map(social => ({ key: social.key, value: social.value })),
        [profile.socials],
    );

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            companyName: profile.companyName,
            contactEmail: profile.contactEmail,
            businessCategories: profile.businessCategories.map(category => category.key),
            description: profile.description,
            languages: profile.languages.map(category => category.key).filter(key => key),
            fullName: profile.fullName,
            position: profile.position,
            socials: profileLinks,
        },
    });

    const { handleSubmit, reset } = methods;

    const onSubmit = useCallback(
        handleSubmit(async data => {
            const { socials, ...dataWithoutSocials } = data;

            const filteredSocials = socials
                ?.filter((social: ISocialLink) => social.value)
                .reduce((acc, b) => ({ ...acc, [b.key]: b.value }), {});

            const newProfile = await updateProfileFx({
                ...dataWithoutSocials,
                socials: filteredSocials || {},
            });

            if (newProfile) {
                const newProfileLinks = newProfile.socials.map(social => ({
                    key: social.key,
                    value: social.value,
                }));

                reset({
                    companyName: newProfile.companyName,
                    contactEmail: newProfile.contactEmail,
                    businessCategories: newProfile.businessCategories.map(category => category.key),
                    description: newProfile.description,
                    languages: newProfile.languages
                        .map(category => category.key)
                        .filter(key => key),
                    fullName: newProfile.fullName,
                    position: newProfile.position,
                    socials: newProfileLinks,
                });
            }
        }),
        [],
    );

    const handleSaveAndQuit = useCallback(async () => {
        await onSubmit();
        await router.push(routeToChange);
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmChangeRouteDialog,
        });
    }, [routeToChange]);

    const handleQuit = useCallback(async () => {
        await router.push(routeToChange);
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.confirmChangeRouteDialog,
        });
    }, [routeToChange]);

    const handleResetForm = useCallback(() => {
        const socials = profile.socials.map(social => ({ key: social.key, value: social.value }));

        reset({
            companyName: profile.companyName,
            contactEmail: profile.contactEmail,
            businessCategories: profile.businessCategories.map(category => category.key),
            description: profile.description,
            languages: profile.languages.map(category => category.key).filter(key => key),
            fullName: profile.fullName,
            position: profile.position,
            socials,
        });
    }, [profile.socials]);

    return (
        <MainProfileWrapper ref={popperRef} className={styles.wrapper}>
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                gap={2}
                className={styles.containerWrapper}
            >
                <CustomGrid container alignItems="center" justifyContent="center">
                    <CustomImage
                        src="/images/edit-hand.png"
                        width="40px"
                        height="40px"
                        alt="edit-hand"
                    />
                    <CustomTypography
                        variant="h1"
                        nameSpace="profile"
                        translation="editProfile.title"
                        className={styles.title}
                    />
                </CustomGrid>
                <CustomGrid flex="1" className={styles.widthWrapper}>
                    <EditAccountInfo />
                </CustomGrid>
                <FormProvider {...methods}>
                    <form onSubmit={onSubmit} className={styles.form}>
                        <CustomGrid
                            container
                            direction="column"
                            gap={2}
                            className={styles.widthWrapper}
                        >
                            <EditCompanyInfo />
                            <EditPersonalInfo />
                            <EditSocialInfo />
                            <DeleteProfile />
                        </CustomGrid>
                        <SubmitProfileInfo onReset={handleResetForm} />
                    </form>
                </FormProvider>
            </CustomGrid>
            <ConfirmChangeRouteDialog onConfirm={handleSaveAndQuit} onCancel={handleQuit} />
            <DeleteProfileDialog />
        </MainProfileWrapper>
    );
});

export { EditProfileContainer };
