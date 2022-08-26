import React, { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { Fade } from '@mui/material';
import { useRouter } from 'next/router';

// custom
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// types
import { AppDialogsEnum, Template } from '../../../store/types';

// stores
import { setPreviewTemplate, appDialogsApi } from '../../../store';

// styles
import styles from './OnboardingTemplateItem.module.scss';

import { StorageKeysEnum, WebStorage } from '../../../controllers/WebStorageController';
import { clientRoutes } from '../../../const/client-routes';

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
        WebStorage.save({ key: StorageKeysEnum.templateId, data: { templateId: template.id } });

        router.push(clientRoutes.registerRoute);
    }, []);

    const previewImage = (template?.previewUrls || []).find(preview => preview.resolution === 1080);

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
                <Image src={previewImage?.url} layout="fill" />
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
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    className={styles.templateButtons}
                    gap={1.5}
                >
                    <CustomButton
                        onClick={handleSetUpTemplate}
                        className={styles.button}
                        disaabled={template.type === 'paid'}
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
