import React, { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import Router from 'next/router';

import { Fade } from '@mui/material';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// stores
import { CommonTemplateItemProps } from '@components/Templates/CommonTemplateItem/types';
import { appDialogsApi } from '../../../store/dialogs';
import { setPreviewTemplate } from '../../../store/templates';
import { createMeetingFx } from '../../../store/meetings';

// types
import { AppDialogsEnum } from '../../../store/types';

// styles
import styles from './CommonTemplateItem.module.scss';

const CommonTemplateItem = memo(({ template }: CommonTemplateItemProps) => {
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
        const result = await createMeetingFx({ templateId: template.id });

        if (result.meeting) {
            await Router.push(`/meeting/${result.meeting.id}`);
        }
    }, []);

    return (
        <CustomGrid
            className={styles.templateContent}
            container
            justifyContent="center"
            alignItems="center"
            onMouseEnter={handleShowPreview}
            onMouseLeave={handleHidePreview}
        >
            <Image src={template.previewUrl} width="334px" height="190px" />
            <Fade in={!showPreview}>
                <TemplateMainInfo
                    name={template.name}
                    description={template.description}
                    maxParticipants={template.maxParticipants}
                    type={template.type}
                    isNeedToShowBusinessInfo
                />
            </Fade>
            <Fade in={showPreview}>
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    className={styles.templateButtons}
                >
                    <CustomButton
                        className={styles.button}
                        nameSpace="templates"
                        translation="buttons.startMeeting"
                        onClick={handleStartMeeting}
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
