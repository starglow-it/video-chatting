import React, { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { useStore } from 'effector-react';
import { Fade } from '@mui/material';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// stores
import clsx from 'clsx';
import { CommonTemplateItemProps } from './types';
import {
    $profileStore,
    $profileTemplatesStore,
    addNotificationEvent,
    appDialogsApi,
    setPreviewTemplate,
} from '../../../store';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';

// styles
import styles from './CommonTemplateItem.module.scss';

const CommonTemplateItem = memo(({ template, onChooseTemplate }: CommonTemplateItemProps) => {
    const profileTemplates = useStore($profileTemplatesStore);
    const profile = useStore($profileStore);

    const isTemplatesLimitReached = profile.maxTemplatesNumber === profileTemplates.count;
    const isTimeLimitReached = profile.maxMeetingTime === 0;

    const [showPreview, setShowPreview] = useState(false);

    const handleShowPreview = useCallback(() => {
        setShowPreview(true);
    }, []);

    const handleHidePreview = useCallback(() => {
        setShowPreview(false);
    }, []);

    const handlePreviewTemplate = useCallback(() => {
        setPreviewTemplate(template);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.templatePreviewDialog,
        });
    }, []);

    const handleStartMeeting = useCallback(async () => {
        onChooseTemplate(template.id);
    }, [onChooseTemplate]);

    const previewImage = (template?.previewUrls || []).find(image => image.resolution === 240);

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
                <Image src={previewImage?.url} width="334px" height="190px" />
            </ConditionalRender>
            <TemplateMainInfo
                show={!showPreview}
                name={template.name}
                description={template.description}
                maxParticipants={template.maxParticipants}
                type={template.type}
                isNeedToShowBusinessInfo
            />
            <Fade in={showPreview}>
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    className={styles.templateButtons}
                >
                    <CustomButton
                        onMouseEnter={isTimeLimitReached ? handleShowToast : undefined}
                        onClick={!isTimeLimitReached ? handleStartMeeting : undefined}
                        className={clsx(styles.button, { [styles.disabled]: isTimeLimitReached })}
                        disableRipple={isTimeLimitReached}
                        nameSpace="templates"
                        translation={
                            isTemplatesLimitReached ? 'buttons.replace' : 'buttons.startMeeting'
                        }
                    />
                    <CustomButton
                        className={styles.button}
                        variant="custom-transparent"
                        nameSpace="templates"
                        translation="buttons.preview"
                        onClick={handlePreviewTemplate}
                    />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
});

export { CommonTemplateItem };
