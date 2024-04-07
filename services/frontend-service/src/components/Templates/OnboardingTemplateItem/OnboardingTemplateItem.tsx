import { memo, useCallback, useState } from 'react';
import { Fade } from '@mui/material';
import clsx from 'clsx';

// custom
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';
import { Translation } from '@library/common/Translation/Translation';

// types
import { ICommonTemplate } from 'shared-types';
import { getPreviewImage } from 'src/utils/functions/getPreviewImage';
import { AppDialogsEnum } from '../../../store/types';

// stores
import { setPreviewTemplate, appDialogsApi } from '../../../store';

//hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// styles
import styles from './OnboardingTemplateItem.module.scss';

import {
    StorageKeysEnum,
    WebStorage,
} from '../../../controllers/WebStorageController';

const OnboardingTemplateItem = memo(
    ({
        template,
        onChooseTemplate,
    }: {
        template: ICommonTemplate;
        onChooseTemplate: (templateId?: string) => void;
    }) => {
        const { isMobile } = useBrowserDetect();
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

        const handleSetUpTemplate = useCallback(async () => {
            WebStorage.save({
                key: StorageKeysEnum.templateId,
                data: { templateId: template.id },
            });

            onChooseTemplate(template.id);
        }, []);

        const previewImage = getPreviewImage(template);

        return (
            <CustomGrid
                className={clsx(styles.templateContent, { [styles.mobile]: isMobile })}
                container
                justifyContent="center"
                alignItems="center"
                onMouseEnter={handleShowPreview}
                onMouseLeave={handleHidePreview}
            >
                <ConditionalRender condition={!!previewImage}>
                    <CustomImage src={previewImage} layout="fill" />
                </ConditionalRender>
                <TemplateMainInfo
                    show={!showPreview}
                    name={template.name}
                    description={template.description}
                    maxParticipants={template.maxParticipants}
                    type={template.type}
                    isNeedToShowBusinessInfo
                    isCommonTemplate
                    authorName={template.authorName}
                    authorRole={template.authorRole}
                    authorThumbnail={template.authorThumbnail}
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
                            className={clsx(styles.button, {[styles.mobile]: isMobile})}
                            disabled={template.type === 'paid'}
                            label={
                                <Translation
                                    nameSpace="templates"
                                    translation="buttons.getStarted"
                                />
                            }
                        />
                        <CustomButton
                            onClick={handlePreviewTemplate}
                            className={clsx(styles.button, {[styles.mobile]: isMobile})}
                            variant="custom-transparent"
                            label={
                                <Translation
                                    nameSpace="templates"
                                    translation="buttons.previewSpace"
                                />
                            }
                        />
                    </CustomGrid>
                </Fade>
            </CustomGrid>
        );
    },
);

export { OnboardingTemplateItem };
