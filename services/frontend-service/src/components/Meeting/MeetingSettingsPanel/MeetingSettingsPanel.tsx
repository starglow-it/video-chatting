import { memo, useCallback, useEffect, useMemo } from 'react';
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

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { RoundCloseIcon } from 'shared-frontend/icons/RoundIcons/RoundCloseIcon';

// stores
import {
    $businessCategoriesStore,
    appDialogsApi,
    checkCustomLinkFx,
    getBusinessCategoriesFx,
} from 'src/store';

// styles
import { ISocialLink } from 'shared-types';
import { customTemplateLinkSchema } from 'shared-frontend/validation';
import styles from './MeetingSettingsPanel.module.scss';

// validations
import { companyNameSchema } from '../../../validation/users/companyName';
import { emailSchema } from '../../../validation/users/email';
import {
    simpleStringSchema,
    simpleStringSchemaWithLength,
} from '../../../validation/common';
import { businessCategoriesSchema } from '../../../validation/users/businessCategories';
import { languagesSchema } from '../../../validation/users/languagesSchema';
import { fullNameSchema } from '../../../validation/users/fullName';
import { validateSocialLink } from '../../../validation/users/socials';

// helpers
import { reduceValuesNumber } from '../../../helpers/mics/reduceKeysNumber';
import { padArray } from '../../../utils/arrays/padArray';

// types
import { AppDialogsEnum } from '../../../store/types';
import { MeetingSettingsPanelProps, SettingsData } from './types';

// const
import { SOCIAL_LINKS } from '../../../const/profile/socials';
import { dashboardRoute } from '../../../const/client-routes';

// utils
import { getClientMeetingUrlWithDomain } from '../../../utils/urls';
import {
    $isEditTemplateOpenStore,
    $isMeetingInfoOpenStore,
    $isOwner,
    setEditTemplateOpenEvent,
    setMeetingInfoOpenEvent,
} from '../../../store/roomStores';

const validationSchema = yup.object({
    companyName: companyNameSchema().required('required'),
    contactEmail: emailSchema(),
    fullName: fullNameSchema().required('required'),
    position: simpleStringSchema(),
    description: simpleStringSchemaWithLength(300),
    businessCategories: businessCategoriesSchema(),
    languages: languagesSchema(),
    signBoard: simpleStringSchema(),
    socials: yup.array().of(validateSocialLink()),
    customLink: customTemplateLinkSchema(),
});

const Component = ({
    template,
    onTemplateUpdate,
    children,
}: MeetingSettingsPanelProps) => {
    const isEditTemplateOpened = useStore($isEditTemplateOpenStore);
    const isMeetingInfoOpened = useStore($isMeetingInfoOpenStore);
    const businessCategories = useStore($businessCategoriesStore);

    const isOwner = useStore($isOwner);

    const router = useRouter();
    const role = router.query.role as string;

    const resolver = useYupValidationResolver<SettingsData>(validationSchema);

    const templateSocialLinks = useMemo<SettingsData['socials']>(
        () =>
            template.socials.map(social => ({
                key: social.key,
                value: social.value,
            })),
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
            businessCategories: template?.businessCategories?.map(
                category => category.key,
            ),
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

    useEffect(() => {
        getBusinessCategoriesFx({});
    }, []);

    useEffect(() => {
        (async () => {
            let roomUrl = getClientMeetingUrlWithDomain(
                template.customLink || template.id,
            );

            if (role === 'luker') {
                roomUrl = `${roomUrl}?role=${role}`;
            }

            await Router.push(roomUrl, roomUrl, { shallow: true });
        })();
    }, [template.customLink, template.id]);

    const dirtyFieldsCount = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { socials, ...dirtyFieldsWithOutSocials } = dirtyFields;

        const values: any[] = Object.values(dirtyFieldsWithOutSocials);

        const newDirtyFieldsCount = values.reduce(reduceValuesNumber, 0);

        const paddedNextSocials = padArray<ISocialLink>(
            (nextSocials || []) as ISocialLink[],
            Object.keys(SOCIAL_LINKS).length,
        );
        const paddedCurrentSocials = padArray<ISocialLink>(
            template?.socials || [],
            Object.keys(SOCIAL_LINKS).length,
        );

        const changedFields = paddedCurrentSocials.map(social => {
            const targetSocial = paddedNextSocials?.find(
                currentSocial => currentSocial?.key === social?.key,
            );
            const isBothEmpty =
                targetSocial?.value === undefined &&
                social?.value === undefined;

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

        const numberOfChangedFields = changedFields.filter(
            value => !value,
        ).length;

        return (
            newDirtyFieldsCount +
            numberOfChangedFields +
            changedNewFields.length
        );
    }, [Object.keys(dirtyFields).length, nextSocials, template.socials]);

    const handleCloseSettingsPanel = useCallback(() => {
        if (!dirtyFieldsCount || isMeetingInfoOpened) {
            setEditTemplateOpenEvent(false);
            setMeetingInfoOpenEvent(false);
            return;
        }

        if (isOwner) {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.editMeetingTemplateDialog,
            });
        }
    }, [dirtyFieldsCount, isOwner, isMeetingInfoOpened]);

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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { socials: dirtySocials, ...dirtyDataWithoutSocials } =
                    dirtyFields;

                const dirtyFieldsKeys = Object.keys(dirtyDataWithoutSocials);

                const filteredData = Object.fromEntries(
                    Object.entries(dataWithoutSocials).filter(([key]) =>
                        dirtyFieldsKeys.includes(key),
                    ),
                );

                if (
                    filteredData.customLink &&
                    template.customLink !== filteredData.customLink
                ) {
                    const isBusy = await checkCustomLinkFx({
                        templateId: template.id,
                        customLink: filteredData.customLink as string,
                    });

                    if (isBusy) {
                        setError('customLink', {
                            type: 'focus',
                            message: 'meeting.settings.customLink.busy',
                        });
                        setFocus('customLink');
                        return;
                    }
                }

                const filteredSocials = socials
                    ?.filter((social: ISocialLink) => social.value)
                    ?.reduce((acc, b) => ({ ...acc, [b.key]: b.value }), {});

                let filteredBusinessCategories;
                if (Array.isArray(filteredData.businessCategories)) {
                    filteredBusinessCategories =
                        filteredData.businessCategories?.map(category =>
                            businessCategories.list.find(
                                ({ key }) => category === key,
                            ),
                        );
                }

                onTemplateUpdate({
                    data: {
                        ...filteredData,
                        socials: (filteredSocials as any) || [],
                        businessCategories:
                            (filteredBusinessCategories as any) || [],
                    } as any,
                    templateId: template.id,
                });

                reset({
                    ...dataWithoutSocials,
                    socials,
                });
            }
            setEditTemplateOpenEvent(false);
        }),
        [
            dirtyFieldsCount,
            template.id,
            template.customLink,
            errors,
            businessCategories.list,
        ],
    );

    const handleCancelEditTemplate = useCallback(() => {
        if (dirtyFieldsCount) {
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.editMeetingTemplateDialog,
            });
        } else {
            router.push(dashboardRoute);
        }
    }, [dirtyFieldsCount]);

    return (
        <CustomBox className={styles.wrapper}>
            <FormProvider {...methods}>
                {children}
                <CustomPaper
                    variant="black-glass"
                    className={clsx(styles.settingsWrapper, {
                        [styles.open]:
                            isEditTemplateOpened || isMeetingInfoOpened,
                    })}
                >
                    <RoundCloseIcon
                        className={styles.closeIcon}
                        onClick={handleCloseSettingsPanel}
                        width="24px"
                        height="24px"
                    />
                    {isOwner ? (
                        <Fade in={isEditTemplateOpened} unmountOnExit>
                            <CustomBox className={styles.fadeContentWrapper}>
                                <form
                                    onSubmit={onSubmit}
                                    className={styles.form}
                                >
                                    <EditTemplateForm
                                        onCancel={handleCancelEditTemplate}
                                    />
                                </form>
                            </CustomBox>
                        </Fade>
                    ) : (
                        <Fade in={isMeetingInfoOpened} unmountOnExit>
                            <CustomBox className={styles.fadeContentWrapper}>
                                <MeetingInfo />
                            </CustomBox>
                        </Fade>
                    )}
                </CustomPaper>
                <ConfirmCancelChangesDialog onClose={handleConfirmClose} />
            </FormProvider>
        </CustomBox>
    );
};

export const MeetingSettingsPanel = memo(Component);
