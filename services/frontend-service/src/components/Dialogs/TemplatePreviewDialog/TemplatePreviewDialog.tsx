import { memo, useCallback } from 'react';
import { useStore } from 'effector-react';

// custom
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// common
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { BusinessCategoryTagsClip } from 'shared-frontend/library/common/BusinessCategoryTagsClip';

// components
import { TemplateParticipants } from '@components/Templates/TemplateParticipants/TemplateParticipants';
import { TemplatePaymentType } from '@components/Templates/TemplatePaymentType/TemplatePaymentType';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { TemplateGeneralInfo } from '@components/Templates/TemplateGeneralInfo/TemplateGeneralInfo';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { ScheduleIcon } from 'shared-frontend/icons/OtherIcons/ScheduleIcon';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// stores
import { Translation } from '@library/common/Translation/Translation';
import {
    $appDialogsStore,
    appDialogsApi,
    $templatePreviewStore,
} from '../../../store';

// types
import { AppDialogsEnum } from '../../../store/types';
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

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.templatePreviewDialog,
        });
    }, []);

    const handleChooseTemplate = useCallback(async () => {
        if (previewTemplate?.id) {
            appDialogsApi.closeDialog({
                dialogKey: AppDialogsEnum.templatePreviewDialog,
            });
            onChooseTemplate?.(previewTemplate.id);
        }
    }, [previewTemplate?.id]);

    const handleScheduleMeeting = useCallback(() => {
        if (previewTemplate?.id)
            onSchedule?.({
                templateId: previewTemplate?.id,
            });

        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.templatePreviewDialog,
        });
    }, [onSchedule, previewTemplate?.id]);

    const previewImage = (previewTemplate?.previewUrls || []).find(
        preview => preview.resolution === 1080,
    );

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
                        companyName=""
                        userName={previewTemplate?.name}
                    />
                    <ConditionalRender
                        condition={
                            !!previewImage?.id || !!previewTemplate?.mediaLink
                        }
                    >
                        <CustomImage
                            src={
                                previewImage?.url ||
                                previewTemplate?.mediaLink?.thumb ||
                                ''
                            }
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
                        {previewTemplate?.businessCategories ? (
                            <BusinessCategoryTagsClip
                                lines={1}
                                maxWidth={210}
                                tags={previewTemplate?.businessCategories}
                            />
                        ) : null}

                        {isNeedToRenderTemplateInfo && (
                            <CustomGrid
                                container
                                className={styles.templateType}
                                justifyContent="flex-end"
                                gap={1}
                                wrap="nowrap"
                            >
                                <TemplatePaymentType
                                    type={previewTemplate?.type || ''}
                                />
                                <TemplateParticipants
                                    number={
                                        previewTemplate?.maxParticipants || 0
                                    }
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
                                label={
                                    <Translation
                                        nameSpace="common"
                                        translation="buttons.schedule"
                                    />
                                }
                                Icon={
                                    <ScheduleIcon
                                        className={styles.scheduleIcon}
                                        width="36px"
                                        height="36px"
                                    />
                                }
                            />
                        )}

                        <CustomButton
                            onClick={handleChooseTemplate}
                            className={styles.chooseBtn}
                            label={
                                <Translation
                                    nameSpace="templates"
                                    translation={`buttons.${chooseButtonKey}`}
                                />
                            }
                        />
                    </CustomGrid>
                </CustomBox>
            </CustomGrid>
        </CustomDialog>
    );
};

export const TemplatePreviewDialog = memo(Component);
