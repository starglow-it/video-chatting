import React, { memo, useCallback, useEffect, useState, useMemo } from 'react';
import { useStore } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import * as yup from 'yup';

import styles from './MeetingProfileSetting.module.scss';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { EditTemplatePersonalInfo } from '@components/Meeting/EditTemplatePersonalInfo/EditTemplatePersonalInfo';
import { CustomAccordion } from 'shared-frontend/library/custom/CustomAccordion';
import { Translation } from '@library/common/Translation/Translation';
import { Socials } from '@components/Socials/Socials';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';

//types
import { ISocialLink } from 'shared-types';

//helper
import { reduceValuesNumber } from '../../../helpers/mics/reduceKeysNumber';
import { padArray } from '../../../utils/arrays/padArray';

//const
import { SOCIAL_LINKS } from '../../../const/profile/socials';

//icons
import { PersonIcon } from 'shared-frontend/icons/OtherIcons/PersonIcon';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';

// validations
import {
    simpleStringSchema,
} from '../../../validation/common';
import { languagesSchema } from '../../../validation/users/languagesSchema';
import { fullNameSchema } from '../../../validation/users/fullName';
import { validateSocialLink } from '../../../validation/users/socials';

// stores
import {
    $meetingTemplateStore,
    updateMeetingTemplateFxWithData,
    updateLocalUserEvent,
    updateUserSocketEvent,
    toggleProfilePanelEvent
} from 'src/store/roomStores';

//hooks
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

import { SettingsData } from './types';

const validationSchema = yup.object({
    fullName: fullNameSchema().required('required'),
    position: simpleStringSchema(),
    languages: languagesSchema(),
    socials: yup.array().of(validateSocialLink()),
});

export const MeetingProfileSetting = () => {
    const meetingTemplate = useStore($meetingTemplateStore);
    const [currentAccordionId, setCurrentAccordionId] = useState('');
    const templateSocialLinks = useMemo<SettingsData['socials']>(
        () =>
            meetingTemplate.socials.map(social => ({
                key: social.key,
                value: social.value,
            })),
        [meetingTemplate?.socials],
    );

    const resolver = useYupValidationResolver<SettingsData>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            fullName: meetingTemplate.fullName,
            position: meetingTemplate.position,
            languages: meetingTemplate.languages.map(category => category.key),
            socials: templateSocialLinks,
        },
    });

    const {
        handleSubmit,
        formState: { dirtyFields, errors },
        reset,
        control,
    } = methods;

    const nextSocials = useWatch({
        control,
        name: 'socials',
    });

    useEffect(() => {
        if (errors) {
            if (errors.fullName) {
                if (currentAccordionId !== 'personal') {
                    handleChangeAccordion('personal');
                }
                return;
            }
        }
    }, [errors]);

    const handleChangeAccordion = useCallback((accordionId: any) => {
        setCurrentAccordionId(prev =>
            prev === accordionId ? '' : accordionId,
        );
    }, []);

    const handleCloseProfileSettingPanel = () => {
        toggleProfilePanelEvent(false);
    };

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
            meetingTemplate?.socials || [],
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
    }, [Object.keys(dirtyFields).length, nextSocials, meetingTemplate.socials]);

    const handleUpdateMeetingTemplate = useCallback(async (updateData: any) => {
        if (updateData) {
            await updateMeetingTemplateFxWithData(updateData.data);
            updateLocalUserEvent({ username: updateData.data.fullName });
            await updateUserSocketEvent({ username: updateData.data.fullName });
        }
    }, []);

    const onSubmit = useCallback(
        handleSubmit(async data => {
            if (!dirtyFieldsCount) {
                handleUpdateMeetingTemplate();
            } else {
                const { socials, ...dataWithoutSocials } = data;
                const { socials: dirtySocials, ...dirtyDataWithoutSocials } =
                    dirtyFields;

                const dirtyFieldsKeys = Object.keys(dirtyDataWithoutSocials);

                const filteredData = Object.fromEntries(
                    Object.entries(dataWithoutSocials).filter(([key]) =>
                        dirtyFieldsKeys.includes(key),
                    ),
                );

                const filteredSocials = socials
                    ?.filter((social: ISocialLink) => social.value)
                    ?.reduce((acc, b) => ({ ...acc, [b.key]: b.value }), {});

                handleUpdateMeetingTemplate({
                    data: {
                        ...filteredData,
                        socials: (filteredSocials as any) || [],
                    } as any,
                    templateId: meetingTemplate.id,
                });

                reset({
                    ...dataWithoutSocials,
                    socials,
                });
            }

            handleCloseProfileSettingPanel();
        }),
        [
            dirtyFieldsCount,
            meetingTemplate.id,
            errors,
        ],
    );

    return (
        <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
                <CustomGrid
                    container
                    direction="column"
                    className={styles.wrapper}
                    gap={3}
                >
                    <CustomTypography
                        nameSpace="meeting"
                        translation="profileSettingPanel.title"
                        color="white"
                        fontSize="20px"
                    />
                    <CustomAccordion
                        AccordionIcon={
                            <PersonIcon width="24px" height="24px" />
                        }
                        currentAccordionId={currentAccordionId}
                        accordionId="personal"
                        onChange={handleChangeAccordion}
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="templates.personal"
                            />
                        }
                    >
                        <EditTemplatePersonalInfo />
                    </CustomAccordion>
                    <CustomAccordion
                        AccordionIcon={
                            <CustomLinkIcon width="24px" height="24px" />
                        }
                        currentAccordionId={currentAccordionId}
                        accordionId="links"
                        onChange={handleChangeAccordion}
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation="templates.links"
                            />
                        }
                    >
                        <Socials buttonClassName={styles.socialBtn} />
                    </CustomAccordion>
                    <CustomGrid
                        item
                        container
                        justifyContent="center"
                    >
                        <CustomButton
                            className={styles.saveBtn}
                            type="submit"
                            label={
                                <Translation
                                    nameSpace="meeting"
                                    translation="profileSettingPanel.saveBtn"
                                />
                            }
                        />
                    </CustomGrid>
                </CustomGrid>
            </form>
        </FormProvider>

    );
};
