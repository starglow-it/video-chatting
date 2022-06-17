import React, { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import { Fade } from '@mui/material';

// components
import { SetUpDevicesButton } from '@components/Media/DeviceSetUpButtons/SetUpDevicesButton';
import { ConfirmCancelChangesDialog } from '@components/Dialogs/ConfirmCancelChangesDialog/ConfirmCancelChangesDialog';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { EditTemplateForm } from '@components/Meeting/EditTemplateForm/EditTemplateForm';
import { MeetingInfo } from '@components/Meeting/MeetingInfo/MeetingInfo';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// icons
import { RoundCloseIcon } from '@library/icons/RoundCloseIcon';
import { EditIcon } from '@library/icons/EditIcon';
import { InfoIcon } from '@library/icons/InfoIcon';

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
import { $isOwner } from '../../../store/meeting';
import { appDialogsApi } from '../../../store/dialogs';

// helpers
import { reduceValuesNumber } from '../../../helpers/mics/reduceKeysNumber';
import { padArray } from '../../../utils/arrays/padArray';
import { useMultipleToggle } from '../../../hooks/useMultipleToggle';

// types
import { AppDialogsEnum, SocialLink } from '../../../store/types';
import {MeetingSettingsPanelProps, SettingsData} from './types';

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
    signBoard: simpleStringSchema(),
    socials: yup.array().of(validateSocialLink()),
});

const MeetingSettingsPanel = memo(
    ({ template, onTemplateUpdate, children }: MeetingSettingsPanelProps) => {
        const router = useRouter();
        const isOwner = useStore($isOwner);

        const {
            values: { isEditTemplateOpened, isMeetingInfoOpened },
            onSwitchOff: handleSwitchOff,
            onSwitchOn: handleSwitchOn,
            onSwitchToggle: handleToggleSwitch,
        } = useMultipleToggle<'isEditTemplateOpened' | 'isMeetingInfoOpened'>([
            'isEditTemplateOpened',
            'isMeetingInfoOpened',
        ]);

        const isAbleToSave = isOwner;

        const resolver = useYupValidationResolver<SettingsData>(validationSchema);

        const templateSocialLinks = useMemo<SettingsData["socials"]>(
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
                signBoard: template.signBoard,
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

        const handleOpenEditTemplate = useCallback(() => {
            handleSwitchOn('isEditTemplateOpened');
        }, []);

        const handleCloseSettingsPanel = useCallback(() => {
            if (!dirtyFieldsCount || isMeetingInfoOpened) {
                return handleSwitchOff();
            }

            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.editMeetingTemplateDialog,
            });
        }, [dirtyFieldsCount]);

        const handleConfirmClose = useCallback(() => {
            handleSwitchOff();
            reset();
            setValue('socials', templateSocialLinks, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }, [templateSocialLinks]);

        const handleOpenDeviceSettings = useCallback(() => {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.devicesSettingsDialog,
            });
        }, []);

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

                    reset({
                        ...dataWithoutSocials,
                        socials,
                    });
                }
                handleSwitchOff();
            }),
            [dirtyFieldsCount, template.id],
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

        const handleOpenMeetingInfo = useCallback(() => {
            handleToggleSwitch('isMeetingInfoOpened');
        }, []);

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
                        <CustomGrid container className={styles.settingsControls} gap={1.5}>
                            <SetUpDevicesButton
                                onAction={handleOpenDeviceSettings}
                            />
                            {!isOwner
                                ? (
                                    <CustomPaper variant="black-glass" className={styles.infoButton}>
                                        <ActionButton
                                            className={styles.iconButton}
                                            onAction={handleOpenMeetingInfo}
                                            Icon={<InfoIcon width="32px" height="32px"/>}
                                        />
                                    </CustomPaper>
                                )
                                : null
                            }
                            {!isEditTemplateOpened && isAbleToSave
                                ? (
                                    <CustomPaper variant="black-glass" className={styles.deviceButton}>
                                        <ActionButton
                                            className={styles.iconButton}
                                            onAction={handleOpenEditTemplate}
                                            Icon={<EditIcon width="30px" height="30px" />}
                                        />
                                    </CustomPaper>
                                )
                                : null
                            }
                        </CustomGrid>

                        <Fade in={isEditTemplateOpened}>
                            <CustomBox className={styles.fadeContentWrapper}>
                                <form onSubmit={onSubmit} className={styles.form}>
                                    <EditTemplateForm onCancel={handleCancelEditTemplate} />
                                </form>
                            </CustomBox>
                        </Fade>

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
