import React, { memo, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// components
import { SetUpDevicesButton } from '@components/Media/DeviceSetUpButtons/SetUpDevicesButton';
import { EditTemplatePersonalInfo } from '@components/Meeting/EditTemplatePersonalInfo/EditTemplatePersonalInfo';
import { EditTemplateCompanyInfo } from '@components/Meeting/EditTemplateCompanyInfo/EditTemplateCompanyInfo';
import { EditTemplateSocialLinks } from '@components/Meeting/EditTemplateSocialLinks/EditTemplateSocialLinks';
import { ConfirmCancelChangesDialog } from '@components/Dialogs/ConfirmCancelChangesDialog/ConfirmCancelChangesDialog';
import { ActionButton } from '@library/common/ActionButton/ActionButton';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomAccordion } from '@library/custom/CustomAccordion/CustomAccordion';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// icons
import { CloseIcon } from '@library/icons/CloseIcon';
import { PersonIcon } from '@library/icons/PersonIcon';
import { MoneyIcon } from '@library/icons/MoneyIcon';
import { CustomLinkIcon } from '@library/icons/CustomLinkIcon';
import { EditIcon } from '@library/icons/EditIcon';

// styles
import styles from './MeetingSettingsPanel.module.scss';

// validations
import { useYupValidationResolver } from '../../../hooks/useYupValidationResolver';
import { companyNameSchema } from '../../../validation/users/companyName';
import { emailSchema } from '../../../validation/users/email';
import { simpleStringSchema } from '../../../validation/common';
import { businessCategoriesSchema } from '../../../validation/users/businessCategories';
import { languagesSchema } from '../../../validation/users/languagesSchema';
import { fullNameSchema } from '../../../validation/users/fullName';
import { validateSocialLink } from '../../../validation/users/socials';

// stores
import { $meetingStore } from '../../../store/meeting';
import { appDialogsApi } from '../../../store/dialogs';
import { $profileStore } from '../../../store/profile';

// helpers
import { reduceValuesNumber } from '../../../helpers/mics/reduceKeysNumber';
import { padArray } from '../../../utils/arrays/padArray';

// types
import { AppDialogsEnum, SocialLink } from '../../../store/types';
import { MeetingSettingsPanelProps } from './types';

// const
import { SOCIAL_LINKS } from '../../../const/profile/socials';

const validationSchema = yup.object({
    companyName: companyNameSchema().required('required'),
    contactEmail: emailSchema(),
    fullName: fullNameSchema().required('required'),
    position: simpleStringSchema(),
    description: simpleStringSchema(),
    businessCategories: businessCategoriesSchema(),
    languages: languagesSchema(),
    socials: yup.array().of(validateSocialLink()),
});

const MeetingSettingsPanel = memo(
    ({ template, onTemplateUpdate, children }: MeetingSettingsPanelProps) => {
        const router = useRouter();

        const isEditTemplateView = router.pathname.includes('edit-template');

        const [open, setOpen] = useState(isEditTemplateView);
        const [currentAccordionId, setCurrentAccordionId] = useState('');

        const meeting = useStore($meetingStore);
        const profile = useStore($profileStore);

        const isOwner = meeting.ownerProfileId === profile.id || isEditTemplateView;

        const resolver = useYupValidationResolver<{
            companyName: string;
            contactEmail: string;
            description: boolean;
            businessCategories: any[];
            languages: any[];
            fullName: string;
            position: string;
            socials: { key: string; value: string }[];
        }>(validationSchema);

        const templateSocialLinks = useMemo<{ key: string; value: string }[]>(
            () => template.socials.map(social => ({ key: social.key, value: social.value })),
            [template?.socials],
        );

        const methods = useForm({
            criteriaMode: 'all',
            resolver,
            defaultValues: {
                companyName: template.companyName,
                contactEmail: template.contactEmail,
                description: template.description,
                fullName: template.fullName,
                position: template.position,
                businessCategories: template.businessCategories.map(category => category.key),
                languages: template.languages.map(category => category.key),
                socials: templateSocialLinks,
            },
        });

        const {
            setValue,
            handleSubmit,
            formState: { dirtyFields },
            reset,
            control,
        } = methods;

        const nextSocials = useWatch({
            control,
            name: 'socials',
        });

        const dirtyFieldsCount = useMemo(() => {
            const { socials, ...dirtyFieldsWithOutSocials } = dirtyFields;

            const dirtyFieldsCount = Object.values(dirtyFieldsWithOutSocials).reduce(
                reduceValuesNumber,
                0,
            ) as number;

            const paddedNextSocials = padArray<SocialLink>(
                nextSocials,
                Object.keys(SOCIAL_LINKS).length,
            );
            const paddedCurrentSocials = padArray<SocialLink>(
                template?.socials,
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

        const handleOpenEditTemplate = useCallback(() => {
            setOpen(true);
        }, []);

        const handleCloseEditTemplate = useCallback(() => {
            if (!dirtyFieldsCount) {
                return setOpen(false);
            }

            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.editMeetingTemplateDialog,
            });
        }, [dirtyFieldsCount]);

        const handleChangeAccordion = useCallback(accordionId => {
            setCurrentAccordionId(prev => (prev === accordionId ? '' : accordionId));
        }, []);

        const handleConfirmClose = useCallback(() => {
            if (isEditTemplateView) {
                router.push('/dashboard/templates');
            } else {
                setOpen(false);
                reset();
                setValue('socials', templateSocialLinks, {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }
        }, [templateSocialLinks, isEditTemplateView]);

        const onSubmit = useCallback(
            handleSubmit(async data => {
                if (!dirtyFieldsCount) {
                    onTemplateUpdate();
                } else {
                    const { socials, ...dataWithoutSocials } = data;

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
                }
                setOpen(false);
            }),
            [dirtyFieldsCount, template.id, isEditTemplateView],
        );

        const handleCancelEditTemplate = useCallback(() => {
            if (dirtyFieldsCount) {
                appDialogsApi.openDialog({
                    dialogKey: AppDialogsEnum.editMeetingTemplateDialog,
                });
            } else {
                router.push('/dashboard/templates');
            }
        }, [dirtyFieldsCount]);

        const handleOpenDeviceSettings = useCallback(() => {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.devicesSettingsDialog,
            });
        }, []);

        return (
            <CustomBox className={styles.wrapper}>
                <FormProvider {...methods}>
                    {children}
                    <CustomPaper
                        variant="black-glass"
                        className={clsx(styles.settingsWrapper, { [styles.open]: open })}
                    >
                        <CloseIcon
                            className={styles.closeIcon}
                            onClick={handleCloseEditTemplate}
                            width="24px"
                            height="24px"
                        />
                        <CustomGrid container className={styles.settingsControls}>
                            <SetUpDevicesButton
                                onAction={
                                    !isEditTemplateView ? handleOpenDeviceSettings : undefined
                                }
                            />
                            {!open && isOwner && (
                                <CustomPaper variant="black-glass" className={styles.deviceButton}>
                                    <ActionButton
                                        className={styles.iconButton}
                                        onAction={handleOpenEditTemplate}
                                        Icon={<EditIcon width="30px" height="30px" />}
                                    />
                                </CustomPaper>
                            )}
                        </CustomGrid>
                        <form onSubmit={onSubmit} className={styles.form}>
                            <CustomGrid
                                container
                                direction="column"
                                flex="1"
                                wrap="nowrap"
                                alignItems="stretch"
                                gap={2.5}
                                className={styles.editTemplateWrapper}
                            >
                                <CustomGrid container alignItems="center">
                                    <EditIcon className={styles.editIcon} />
                                    <CustomTypography
                                        color="colors.white.primary"
                                        variant="h4bold"
                                        nameSpace="meeting"
                                        translation="templates.editTemplate"
                                    />
                                </CustomGrid>
                                <CustomGrid item flex="1 1 auto" className={styles.scrollWrapper}>
                                    <CustomScroll>
                                        <CustomGrid container direction="column" gap={2}>
                                            <CustomAccordion
                                                AccordionIcon={
                                                    <PersonIcon width="24px" height="24px" />
                                                }
                                                currentAccordionId={currentAccordionId}
                                                accordionId="personal"
                                                onChange={handleChangeAccordion}
                                                nameSpace="meeting"
                                                translation="templates.personal"
                                            >
                                                <EditTemplatePersonalInfo />
                                            </CustomAccordion>
                                            <CustomAccordion
                                                AccordionIcon={
                                                    <MoneyIcon width="24px" height="24px" />
                                                }
                                                currentAccordionId={currentAccordionId}
                                                accordionId="company"
                                                onChange={handleChangeAccordion}
                                                nameSpace="meeting"
                                                translation="templates.company"
                                            >
                                                <EditTemplateCompanyInfo />
                                            </CustomAccordion>
                                            <CustomAccordion
                                                AccordionIcon={
                                                    <CustomLinkIcon width="24px" height="24px" />
                                                }
                                                currentAccordionId={currentAccordionId}
                                                accordionId="links"
                                                onChange={handleChangeAccordion}
                                                nameSpace="meeting"
                                                translation="templates.links"
                                            >
                                                <EditTemplateSocialLinks />
                                            </CustomAccordion>
                                        </CustomGrid>
                                    </CustomScroll>
                                </CustomGrid>
                                <CustomButton
                                    className={styles.saveBtn}
                                    type="submit"
                                    nameSpace="meeting"
                                    translation="templates.buttons.saveChanges"
                                />
                                {isEditTemplateView && (
                                    <CustomButton
                                        onClick={handleCancelEditTemplate}
                                        className={styles.saveBtn}
                                        variant="custom-cancel"
                                        nameSpace="meeting"
                                        translation="templates.buttons.cancelChanges"
                                        typographyProps={{
                                            color: 'colors.white.primary',
                                        }}
                                    />
                                )}
                            </CustomGrid>
                        </form>
                    </CustomPaper>
                    <ConfirmCancelChangesDialog onClose={handleConfirmClose} />
                </FormProvider>
            </CustomBox>
        );
    },
);

export { MeetingSettingsPanel };
