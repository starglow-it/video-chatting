import React, { memo, useCallback, useState } from 'react';
import { Fade } from '@mui/material';
import { useRouter } from 'next/router';

// custom
import { CustomButton } from 'shared-frontend/library';
import { CustomGrid } from 'shared-frontend/library';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// types
import { CustomImage } from 'shared-frontend/library';
import { ICommonTemplate } from 'shared-types';
import { Translation } from '@library/common/Translation/Translation';
import { AppDialogsEnum } from '../../../store/types';

// shared

// stores
import { setPreviewTemplate, appDialogsApi } from '../../../store';

// styles
import styles from './OnboardingTemplateItem.module.scss';

import { StorageKeysEnum, WebStorage } from '../../../controllers/WebStorageController';
import { clientRoutes } from '../../../const/client-routes';

const OnboardingTemplateItem = memo(({ template }: { template: ICommonTemplate }) => {
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

    const previewImage = (template?.previewUrls || []).find(preview => preview.resolution === 240);

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
                <CustomImage src={previewImage?.url ?? ''} layout="fill" />
            </ConditionalRender>
            <TemplateMainInfo
                show={!showPreview}
                name={template.name}
                description={template.description}
                maxParticipants={template.maxParticipants}
                type={template.type}
                isNeedToShowBusinessInfo
                isCommonTemplate
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
                        label={
                            <Translation nameSpace="templates" translation="buttons.getStarted" />
                        }
                    />
                    <CustomButton
                        onClick={handlePreviewTemplate}
                        className={styles.button}
                        variant="custom-transparent"
                        label={
                            <Translation nameSpace="templates" translation="buttons.previewSpace" />
                        }
                    />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
});

export { OnboardingTemplateItem };
