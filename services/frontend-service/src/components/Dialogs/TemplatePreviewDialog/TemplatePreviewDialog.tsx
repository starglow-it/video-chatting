import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// common
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { TemplateParticipants } from '@components/Templates/TemplateParticipants/TemplateParticipants';
import { TemplatePaymentType } from '@components/Templates/TemplatePaymentType/TemplatePaymentType';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { TemplateGeneralInfo } from '@components/Templates/TemplateGeneralInfo/TemplateGeneralInfo';
import { BusinessCategoryTagsClip } from '@components/BusinessCategoryTagsClip/BusinessCategoryTagsClip';

// icons
import { ArrowLeftIcon } from '@library/icons/ArrowLeftIcon';
import { ScheduleIcon } from '@library/icons/ScheduleIcon';

// shared
import { CustomImage } from 'shared-frontend/library';

// stores
import {
    $appDialogsStore,
    $profileStore,
    addNotificationEvent,
    appDialogsApi,
    $templatePreviewStore,
    $isBusinessSubscription,
} from '../../../store';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';
import { TemplatePreviewDialogProps } from './types';

// styles
import styles from './TemplatePreviewDialog.module.scss';

const Component = ({
    onChooseTemplate,
    chooseButtonKey,
    isNeedToRenderTemplateInfo,
    onSchedule,
}: TemplatePreviewDialogProps) => {
    const { templatePreviewDialog } = useStore($appDialogsStore);
    const previewTemplate = useStore($templatePreviewStore);
    const profile = useStore($profileStore);
    const isBusinessSubscription = useStore($isBusinessSubscription);

    const isTimeLimitReached = profile.maxMeetingTime === 0 && !isBusinessSubscription;

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.templatePreviewDialog,
        });
    }, []);

    const handleChooseTemplate = useCallback(async () => {
        if (previewTemplate?.id) {
            onChooseTemplate?.(previewTemplate.id);
        }
    }, [previewTemplate?.id]);

    const handleScheduleMeeting = useCallback(() => {
        if (previewTemplate?.id) onSchedule?.({ templateId: previewTemplate?.id });

        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.templatePreviewDialog,
        });
    }, [onSchedule, previewTemplate?.id]);

    const previewImage = (previewTemplate?.previewUrls || []).find(
        preview => preview.resolution === 1080,
    );

    const handleShowToast = () => {
        addNotificationEvent({
            type: NotificationType.NoTimeLeft,
            message: `subscriptions.noTimeLeft`,
        });
    };

    return (
        <CustomDialog
            open={templatePreviewDialog}
            onClose={handleClose}
            contentClassName={styles.dialogContent}
            maxWidth="lg"
            withCloseButton={false}
            withNativeCloseBehavior
        >
            <CustomGrid container wrap="nowrap">
                <CustomGrid className={styles.templatePreview}>
                    <TemplateGeneralInfo
                        companyName={previewTemplate?.companyName}
                        userName={previewTemplate?.name}
                    />
                    <ConditionalRender condition={Boolean(previewImage?.id)}>
                        <CustomImage
                            src={previewImage?.url || ''}
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                        />
                    </ConditionalRender>
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
                            tags={previewTemplate?.businessCategories}
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
                            onMouseEnter={isTimeLimitReached ? handleShowToast : undefined}
                            onClick={!isTimeLimitReached ? handleChooseTemplate : undefined}
                            className={clsx(styles.chooseBtn, {
                                [styles.disabled]: isTimeLimitReached,
                            })}
                            disableRipple={isTimeLimitReached}
                            nameSpace="templates"
                            translation={`buttons.${chooseButtonKey}`}
                        />
                    </CustomGrid>
                </CustomBox>
            </CustomGrid>
        </CustomDialog>
    );
};

export const TemplatePreviewDialog = memo(Component);
