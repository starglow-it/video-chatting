import React, { memo, useMemo, useRef } from 'react';
import { useStore } from 'effector-react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useRouter } from 'next/router';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { MainProfileWrapper } from '@components/MainProfileWrapper/MainProfileWrapper';
import { EditAccountInfo } from '@components/Profile/EditAccountInfo/EditAccountInfo';
import { EditCompanyInfo } from '@components/Profile/EditCompanyInfo/EditCompanyInfo';
import { EditSocialInfo } from '@components/Profile/EditSocialInfo/EditSocialInfo';
import { DeleteProfileDialog } from '@components/Dialogs/DeleteProfileDialog/DeleteProfileDialog';
import { DeleteProfile } from '@components/Profile/DeleteProfile/DeleteProfile';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// stores
import { IBusinessCategory, ILanguage, ISocialLink } from 'shared-types';
import {
    $profileStore,
    addNotificationEvent,
    updateProfileFx,
} from '../../store';

// validations
import { companyNameSchema } from '../../validation/users/companyName';
import { emailSchema } from '../../validation/users/email';
import {
    simpleStringSchema,
    simpleStringSchemaWithLength,
} from '../../validation/common';
import { businessCategoriesSchema } from '../../validation/users/businessCategories';
import { languagesSchema } from '../../validation/users/languagesSchema';
import { fullNameSchema } from '../../validation/users/fullName';
import { validateSocialLink } from '../../validation/users/socials';

// styles
import styles from './EditProfileContainer.module.scss';

// types
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { Translation } from '@library/common/Translation/Translation';
import { dashboardRoute } from 'src/const/client-routes';
import { NotificationType } from '../../store/types';

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
        () =>
            profile.socials.map(social => ({
                key: social.key,
                value: social.value,
            })),
        [profile.socials],
    );

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            companyName: profile.companyName,
            contactEmail: profile.contactEmail,
            businessCategories: profile?.businessCategories?.map(
                category => category.key,
            ),
            description: profile.description,
            languages: profile.languages
                .map(category => category.key)
                .filter(key => key),
            fullName: profile.fullName,
            position: profile.position,
            socials: profileLinks,
        },
    });

    const { reset, getValues } = methods;

    const onSave = async () => {
        const { socials, ...dataWithoutSocials } = getValues();

        const filteredSocials = socials
            ?.filter((social: ISocialLink) => social.value)
            .reduce((acc, b) => ({ ...acc, [b.key]: b.value }), {});

        const { profile: newProfile, error } = await updateProfileFx({
            ...dataWithoutSocials,
            socials: filteredSocials || {},
        });

        if (newProfile) {
            const newProfileLinks = newProfile.socials.map(social => ({
                key: social.key,
                value: social.value,
            }));
            addNotificationEvent({
                withSuccessIcon: true,
                message: 'profile.updateProfileSuccess',
                type: NotificationType.SubscriptionSuccess,
            });

            reset({
                companyName: newProfile.companyName,
                contactEmail: newProfile.contactEmail,
                businessCategories: newProfile?.businessCategories?.map(
                    category => category.key,
                ),
                description: newProfile.description,
                languages: newProfile.languages
                    .map(category => category.key)
                    .filter(key => key),
                fullName: newProfile.fullName,
                position: newProfile.position,
                socials: newProfileLinks,
            });
            router.push(dashboardRoute);
        } else {
            addNotificationEvent({
                withErrorIcon: true,
                message: error?.message as string,
                type: NotificationType.SubscriptionSuccess,
            });
        }
    };

    return (
        <MainProfileWrapper ref={popperRef} className={styles.wrapper}>
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                gap={2}
                className={styles.containerWrapper}
            >
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="center"
                    className={styles.widthWrapper}
                >
                    <CustomGrid
                        flex={1}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CustomImage
                            src="/images/edit-hand.webp"
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
                    <CustomButton
                        className={styles.confirmButton}
                        type="submit"
                        label={
                            <Translation
                                nameSpace="common"
                                translation="buttons.save"
                            />
                        }
                        typographyProps={{
                            variant: 'body2',
                        }}
                        onClick={onSave}
                    />
                </CustomGrid>
                <CustomGrid flex="1" className={styles.widthWrapper}>
                    <EditAccountInfo />
                </CustomGrid>
                <FormProvider {...methods}>
                    <CustomGrid
                        container
                        direction="column"
                        gap={2}
                        className={styles.widthWrapper}
                    >
                        <EditCompanyInfo />
                        <EditSocialInfo />
                        <DeleteProfile />
                    </CustomGrid>
                </FormProvider>
            </CustomGrid>
            <DeleteProfileDialog />
        </MainProfileWrapper>
    );
});

export { EditProfileContainer };
