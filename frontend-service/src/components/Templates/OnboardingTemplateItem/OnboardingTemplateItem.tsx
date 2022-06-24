import React, { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { Fade } from '@mui/material';
import { useRouter } from 'next/router';

// custom
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// types
import { AppDialogsEnum, Template } from '../../../store/types';

// stores
import { appDialogsApi } from '../../../store';
import { setPreviewTemplate } from '../../../store';

// styles
import styles from './OnboardingTemplateItem.module.scss';

import { StorageKeysEnum, WebStorage } from '../../../controllers/WebStorageController';

const OnboardingTemplateItem = memo(({ template }: { template: Template }) => {
    const router = useRouter();

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

    const handleSetUpTemplate = useCallback(() => {
        WebStorage.save({ key: StorageKeysEnum.templateId, data: template.id });

        router.push('/register');
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
            <Image src={template.previewUrl} layout="fill" />
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
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    className={styles.templateButtons}
                    gap={1.5}
                >
                    <CustomButton
                        onClick={handleSetUpTemplate}
                        className={styles.button}
                        nameSpace="templates"
                        translation="buttons.getStarted"
                    />
                    <CustomButton
                        onClick={handlePreviewTemplate}
                        className={styles.button}
                        variant="custom-transparent"
                        nameSpace="templates"
                        translation="buttons.previewSpace"
                    />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
});

export { OnboardingTemplateItem };
