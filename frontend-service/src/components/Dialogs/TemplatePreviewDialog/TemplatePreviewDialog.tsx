import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import Image from 'next/image';

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// components
import { TemplateParticipants } from '@components/Templates/TemplateParticipants/TemplateParticipants';
import { TemplatePaymentType } from '@components/Templates/TemplatePaymentType/TemplatePaymentType';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { TemplateGeneralInfo } from '@components/Templates/TemplateGeneralInfo/TemplateGeneralInfo';
import { BusinessCategoryTagsClip } from '@components/BusinessCategoryTagsClip/BusinessCategoryTagsClip';

import { ArrowLeftIcon } from '@library/icons/ArrowLeftIcon';
import { ScheduleIcon } from '@library/icons/ScheduleIcon';

// stores
import { $appDialogsStore, appDialogsApi } from '../../../store/dialogs';
import { $templatePreviewStore } from '../../../store/templates';
import { $profileStore } from '../../../store/profile';

// types
import { AppDialogsEnum } from '../../../store/types';
import { TemplatePreviewDialogProps } from './types';

// styles
import styles from './TemplatePreviewDialog.module.scss';

const TemplatePreviewDialog = memo(
    ({
        onChooseTemplate,
        chooseButtonKey,
        isNeedToRenderTemplateInfo,
        onSchedule,
    }: TemplatePreviewDialogProps) => {
        const { templatePreviewDialog } = useStore($appDialogsStore);
        const previewTemplate = useStore($templatePreviewStore);
        const profile = useStore($profileStore);

        const handleClose = useCallback(() => {
            appDialogsApi.closeDialog({
                dialogKey: AppDialogsEnum.templatePreviewDialog,
            });
        }, []);

        const handleChooseTemplate = useCallback(async () => {
            if (previewTemplate?.id) {
                onChooseTemplate?.({
                    templateId: previewTemplate?.id!,
                });
            }
        }, [previewTemplate?.id]);

        const handleScheduleMeeting = useCallback(() => {
            previewTemplate?.id && onSchedule?.({ templateId: previewTemplate?.id });

            appDialogsApi.closeDialog({
                dialogKey: AppDialogsEnum.templatePreviewDialog,
            });
        }, [onSchedule, previewTemplate?.id]);

        return (
            <CustomDialog
                open={templatePreviewDialog}
                onBackdropClick={handleClose}
                contentClassName={styles.dialogContent}
                maxWidth="lg"
            >
                <CustomGrid container wrap="nowrap">
                    <CustomGrid className={styles.templatePreview}>
                        <TemplateGeneralInfo
                            profileAvatar={profile?.profileAvatar?.url || ''}
                            companyName={previewTemplate?.companyName || ''}
                            userName={profile.fullName}
                        />
                        {Boolean(previewTemplate?.previewUrl) && (
                            <Image src={previewTemplate?.previewUrl || ''} layout="fill" />
                        )}
                    </CustomGrid>
                    <CustomBox className={styles.templateInfoContent}>
                        <CustomGrid
                            container
                            wrap="nowrap"
                            justifyContent="space-between"
                            className={styles.templateInfo}
                            gap={2}
                        >
                            <BusinessCategoryTagsClip
                                lines={1}
                                maxWidth={210}
                                tags={previewTemplate?.businessCategories || []}
                            />
                            {isNeedToRenderTemplateInfo && (
                                <CustomGrid
                                    container
                                    className={styles.templateType}
                                    justifyContent="flex-end"
                                    gap={1}
                                    wrap="nowrap"
                                >
                                    <TemplatePaymentType type={previewTemplate?.type || ''} />
                                    <TemplateParticipants
                                        number={previewTemplate?.maxParticipants || 0}
                                    />
                                </CustomGrid>
                            )}
                        </CustomGrid>
                        <CustomTypography className={styles.name} variant="h2bold">
                            {previewTemplate?.name || ''}
                        </CustomTypography>
                        <CustomTypography className={styles.description}>
                            {previewTemplate?.description || ''}
                        </CustomTypography>
                        <CustomGrid
                            container
                            wrap="nowrap"
                            className={styles.buttons}
                            alignItems="flex-end"
                            gap={2}
                        >
                            <ActionButton
                                variant="decline"
                                onAction={handleClose}
                                className={styles.backBtn}
                                Icon={<ArrowLeftIcon width="36px" height="36px" />}
                            />

                            {Boolean(onSchedule) && (
                                <CustomButton
                                    variant="custom-common"
                                    className={styles.scheduleButton}
                                    onClick={handleScheduleMeeting}
                                    Icon={
                                        <ScheduleIcon
                                            className={styles.scheduleIcon}
                                            width="36px"
                                            height="36px"
                                        />
                                    }
                                    nameSpace="common"
                                    translation="buttons.schedule"
                                />
                            )}

                            <CustomButton
                                onClick={handleChooseTemplate}
                                className={styles.chooseBtn}
                                nameSpace="templates"
                                translation={`buttons.${chooseButtonKey}`}
                            />
                        </CustomGrid>
                    </CustomBox>
                </CustomGrid>
            </CustomDialog>
        );
    },
);

export { TemplatePreviewDialog };
