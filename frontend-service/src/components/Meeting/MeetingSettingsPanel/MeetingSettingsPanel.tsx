import React, { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { useStore } from 'effector-react';
import Router, { useRouter } from 'next/router';
import { Fade } from '@mui/material';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

// components
import { ConfirmCancelChangesDialog } from '@components/Dialogs/ConfirmCancelChangesDialog/ConfirmCancelChangesDialog';
import { EditTemplateForm } from '@components/Meeting/EditTemplateForm/EditTemplateForm';
import { MeetingInfo } from '@components/Meeting/MeetingInfo/MeetingInfo';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// icons
import { RoundCloseIcon } from '@library/icons/RoundIcons/RoundCloseIcon';

// stores
import {
    $isEditTemplateOpenStore,
    $isMeetingInfoOpenStore,
    checkCustomLinkFxWithData,
    setEditTemplateOpenEvent,
    setMeetingInfoOpenEvent,
    appDialogsApi,
    $isOwner,
} from 'src/store';

// styles
import styles from './MeetingSettingsPanel.module.scss';

// validations
import { companyNameSchema } from '../../../validation/users/companyName';
import { emailSchema } from '../../../validation/users/email';
import { simpleStringSchema } from '../../../validation/common';
import { businessCategoriesSchema } from '../../../validation/users/businessCategories';
import { languagesSchema } from '../../../validation/users/languagesSchema';
import { fullNameSchema } from '../../../validation/users/fullName';
import { validateSocialLink } from '../../../validation/users/socials';
import { customTemplateLinkSchema } from '../../../validation/templates/customLink';

// helpers
import { reduceValuesNumber } from '../../../helpers/mics/reduceKeysNumber';
import { padArray } from '../../../utils/arrays/padArray';

// types
import { AppDialogsEnum, SocialLink } from '../../../store/types';
import { MeetingSettingsPanelProps, SettingsData } from './types';

// const
import { SOCIAL_LINKS } from '../../../const/profile/socials';

// utils
import { getClientMeetingUrlWithDomain } from '../../../utils/urls';

const validationSchema = yup.object({
    companyName: companyNameSchema().required('required'),
    contactEmail: emailSchema(),
    fullName: fullNameSchema().required('required'),
    position: simpleStringSchema(),
    description: simpleStringSchema(),
    businessCategories: businessCategoriesSchema(),
    languages: languagesSchema(),
    signBoard: simpleStringSchema(),
    socials: yup.array().of(validateSocialLink()),
    customLink: customTemplateLinkSchema(),
});

const MeetingSettingsPanel = memo(
    ({ template, onTemplateUpdate, children }: MeetingSettingsPanelProps) => {
        const isEditTemplateOpened = useStore($isEditTemplateOpenStore);
        const isMeetingInfoOpened = useStore($isMeetingInfoOpenStore);

        const isOwner = useStore($isOwner);

        const router = useRouter();

        const resolver = useYupValidationResolver<SettingsData>(validationSchema);

        const templateSocialLinks = useMemo<SettingsData['socials']>(
            () => template.socials.map(social => ({ key: social.key, value: social.value })),
            [template?.socials],
        );

        const methods = useForm({
            criteriaMode: 'all',
            resolver,
            defaultValues: {
                companyName: template.companyName,
                contactEmail: template.contactEmail,
                fullName: template.fullName,
                position: template.position,
                signBoard: template.signBoard,
                businessCategories: template.businessCategories.map(category => category.key),
                languages: template.languages.map(category => category.key),
                socials: templateSocialLinks,
                customLink: template.customLink,
                description: template.description,
            },
        });

        const {
            setValue,
            handleSubmit,
            formState: { dirtyFields, errors },
            reset,
            control,
            setError,
            setFocus,
        } = methods;

        const nextSocials = useWatch({
            control,
            name: 'socials',
        });

        const dirtyFieldsCount = useMemo(() => {
            const { socials, ...dirtyFieldsWithOutSocials } = dirtyFields;

            const values: (boolean | { [key: string]: boolean })[] =
                Object.values(dirtyFieldsWithOutSocials);

            const dirtyFieldsCount = values.reduce(reduceValuesNumber, 0);

            const paddedNextSocials = padArray<SocialLink>(
                (nextSocials || []) as SocialLink[],
                Object.keys(SOCIAL_LINKS).length,
            );
            const paddedCurrentSocials = padArray<SocialLink>(
                template?.socials || [],
                Object.keys(SOCIAL_LINKS).length,
            );

            const changedFields = paddedCurrentSocials.map(social => {
                const targetSocial = paddedNextSocials?.find(
                    currentSocial => currentSocial?.key === social?.key,
                );
                const isBothEmpty =
                    targetSocial?.value === undefined && social?.value === undefined;

                const isExistedNotChanged =
                    targetSocial?.value && targetSocial?.value === social?.value;

                return isBothEmpty || isExistedNotChanged;
            });

            const changedNewFields = paddedNextSocials
                .map(social => {
                    const targetSocial = paddedCurrentSocials?.find(
                        currentSocial => currentSocial?.key === social?.key,
                    );

                    return !targetSocial?.value && social?.value;
                })
                .filter(Boolean);

            const numberOfChangedFields = changedFields.filter(value => !value).length;

            return dirtyFieldsCount + numberOfChangedFields + changedNewFields.length;
        }, [Object.keys(dirtyFields).length, nextSocials, template.socials]);

        const handleCloseSettingsPanel = useCallback(() => {
            if (!dirtyFieldsCount || isMeetingInfoOpened) {
                setEditTemplateOpenEvent(false);
                setMeetingInfoOpenEvent(false);
                return;
            }

            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.editMeetingTemplateDialog,
            });
        }, [dirtyFieldsCount]);

        const handleConfirmClose = useCallback(() => {
            setEditTemplateOpenEvent(false);
            reset();
            setValue('socials', templateSocialLinks, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }, [templateSocialLinks]);

        const onSubmit = useCallback(
            handleSubmit(async data => {
                if (!dirtyFieldsCount) {
                    onTemplateUpdate();
                } else {
                    const { socials, ...dataWithoutSocials } = data;

                    if (
                        dataWithoutSocials.customLink &&
                        template.customLink !== dataWithoutSocials.customLink
                    ) {
                        const isBusy = await checkCustomLinkFxWithData({
                            templateId: dataWithoutSocials.customLink,
                        });

                        if (isBusy) {
                            setError('customLink', [
                                { type: 'focus', message: 'meeting.settings.customLink.busy' },
                            ]);
                            setFocus('customLink');
                            return;
                        }
                    }

                    const filteredSocials = socials
                        ?.filter((social: SocialLink) => social.value)
                        ?.reduce((acc, b) => ({ ...acc, [b.key]: b.value }), {});

                    onTemplateUpdate({
                        data: {
                            ...dataWithoutSocials,
                            socials: filteredSocials || {},
                        },
                        templateId: template.id,
                    });

                    reset({
                        ...dataWithoutSocials,
                        socials,
                    });

                    if (
                        (template.customLink || dataWithoutSocials.customLink) &&
                        template.customLink !== dataWithoutSocials.customLink
                    ) {
                        const roomUrl = getClientMeetingUrlWithDomain(
                            dataWithoutSocials.customLink || template.id,
                        );

                        Router.push(roomUrl, roomUrl, { shallow: true });
                    }
                }
                setEditTemplateOpenEvent(false);
            }),
            [dirtyFieldsCount, template.id, template.customLink, errors],
        );

        const handleCancelEditTemplate = useCallback(() => {
            if (dirtyFieldsCount) {
                appDialogsApi.openDialog({
                    dialogKey: AppDialogsEnum.editMeetingTemplateDialog,
                });
            } else {
                router.push('/dashboard');
            }
        }, [dirtyFieldsCount]);

        return (
            <CustomBox className={styles.wrapper}>
                <FormProvider {...methods}>
                    {children}
                    <CustomPaper
                        variant="black-glass"
                        className={clsx(styles.settingsWrapper, {
                            [styles.open]: isEditTemplateOpened || isMeetingInfoOpened,
                        })}
                    >
                        <RoundCloseIcon
                            className={styles.closeIcon}
                            onClick={handleCloseSettingsPanel}
                            width="24px"
                            height="24px"
                        />

                        <ConditionalRender condition={isOwner}>
                            <Fade in={isEditTemplateOpened}>
                                <CustomBox className={styles.fadeContentWrapper}>
                                    <form onSubmit={onSubmit} className={styles.form}>
                                        <EditTemplateForm onCancel={handleCancelEditTemplate} />
                                    </form>
                                </CustomBox>
                            </Fade>
                        </ConditionalRender>

                        <Fade in={isMeetingInfoOpened}>
                            <CustomBox className={styles.fadeContentWrapper}>
                                <MeetingInfo />
                            </CustomBox>
                        </Fade>
                    </CustomPaper>
                    <ConfirmCancelChangesDialog onClose={handleConfirmClose} />
                </FormProvider>
            </CustomBox>
        );
    },
);

export { MeetingSettingsPanel };
