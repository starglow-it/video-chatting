import React, { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { Fade } from '@mui/material';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// icon
import { DeleteIcon } from '@library/icons/DeleteIcon';

// common
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';
import { TemplateInfo } from '@components/Templates/TemplateInfo/TemplateInfo';

// stores
import {
    $isBusinessSubscription,
    $profileStore,
    addNotificationEvent,
    appDialogsApi,
    setDeleteTemplateIdEvent,
    setScheduleTemplateIdEvent,
} from '../../../store';

// styles
import styles from './ProfileTemplateItem.module.scss';

// types
import { ProfileTemplateProps } from './types';
import { AppDialogsEnum, NotificationType } from '../../../store/types';

const ProfileTemplateItem = memo(({ template, onChooseTemplate }: ProfileTemplateProps) => {
    const profile = useStore($profileStore);
    const isBusinessSubscription = useStore($isBusinessSubscription);

    const isDisabled = profile.maxMeetingTime === 0 && !isBusinessSubscription;

    const [showPreview, setShowPreview] = useState(false);

    const handleShowPreview = useCallback(() => {
        setShowPreview(true);
    }, []);

    const handleHidePreview = useCallback(() => {
        setShowPreview(false);
    }, []);

    const handleCreateMeeting = useCallback(async () => {
        onChooseTemplate?.(template.id);
    }, []);

    const handleOpenDeleteDialog = useCallback(() => {
        setDeleteTemplateIdEvent(template.id);

        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.deleteTemplateDialog,
        });
    }, [template.id]);

    const handleScheduleMeeting = useCallback(() => {
        setScheduleTemplateIdEvent(template.id);

        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.scheduleMeetingDialog,
        });
    }, []);

    const previewImage = (template?.previewUrls || []).find(preview => preview.resolution === 240);

    const handleShowToast = () => {
        addNotificationEvent({
            type: NotificationType.NoTimeLeft,
            message: `subscriptions.noTimeLeft`,
        });
    };

    return (
        <CustomGrid
            className={styles.templateContent}
            container
            justifyContent="center"
            alignItems="center"
            onMouseEnter={handleShowPreview}
            onMouseLeave={handleHidePreview}
        >
            <ConditionalRender condition={Boolean(previewImage?.url)}>
                <Image src={previewImage?.url || ''} width="334px" height="190px" />
            </ConditionalRender>
            <TemplateMainInfo
                show={!showPreview}
                name={template.name}
                description={template.description}
                maxParticipants={template.maxParticipants}
                isNeedToShowBusinessInfo
            />
            <Fade in={showPreview}>
                <CustomGrid
                    container
                    direction="column"
                    justifyContent="space-between"
                    className={styles.templateMenu}
                >
                    <TemplateInfo
                        className={styles.avatar}
                        name={template.name}
                        description={template.description}
                    />
                    <CustomGrid container wrap="nowrap" gap={1.5}>
                        <CustomButton
                            onMouseEnter={isDisabled ? handleShowToast : undefined}
                            onClick={!isDisabled ? handleCreateMeeting : undefined}
                            className={clsx(styles.startMeetingBtn, {
                                [styles.disabled]: isDisabled,
                            })}
                            nameSpace="templates"
                            disableRipple={isDisabled}
                            translation="buttons.startMeeting"
                            typographyProps={{
                                variant: 'body2',
                            }}
                        />
                        <CustomButton
                            variant="custom-transparent"
                            onClick={handleScheduleMeeting}
                            className={styles.startMeetingBtn}
                            nameSpace="templates"
                            translation="buttons.schedule"
                            typographyProps={{
                                variant: 'body2',
                            }}
                        />
                    </CustomGrid>
                    <ConditionalRender condition={template.type !== 'paid'}>
                        <ActionButton
                            variant="transparent"
                            onAction={handleOpenDeleteDialog}
                            className={styles.deleteBtn}
                            Icon={<DeleteIcon width="22px" height="22px" />}
                        />
                    </ConditionalRender>
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
});

export { ProfileTemplateItem };
