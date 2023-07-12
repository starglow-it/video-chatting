import React, { memo, useCallback, useState } from 'react';
import { Fade } from '@mui/material';
import { useRouter } from 'next/router';

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
import { AppDialogsEnum } from '../../../store/types';

// stores
import {
    setPreviewTemplate,
    appDialogsApi,
    initUserWithoutTokenFx,
} from '../../../store';

// styles
import styles from './OnboardingTemplateItem.module.scss';

import {
    StorageKeysEnum,
    WebStorage,
} from '../../../controllers/WebStorageController';
import { clientRoutes } from '../../../const/client-routes';
import { parseCookies } from 'nookies';
import { getClientMeetingUrl } from 'src/utils/urls';

const OnboardingTemplateItem = memo(
    ({ template }: { template: ICommonTemplate }) => {
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

        const handleSetUpTemplate = useCallback(async () => {
            WebStorage.save({
                key: StorageKeysEnum.templateId,
                data: { templateId: template.id },
            });

            const { userWithoutLoginId, userTemplateId } = parseCookies();
            if (!userWithoutLoginId) await initUserWithoutTokenFx();
            else router.push(getClientMeetingUrl(userTemplateId));
        }, []);

        const previewImage = (template?.previewUrls || []).find(
            preview => preview.resolution === 240,
        );

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
                            className={styles.button}
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
                            className={styles.button}
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
