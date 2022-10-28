import React, { memo, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { Fade } from '@mui/material';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// shared
import { CustomImage } from 'shared-frontend/library';

// stores
import { setPreviewTemplate, appDialogsApi } from '../../../store';

// styles
import styles from './DiscoverTemplateItem.module.scss';

// types
import { AppDialogsEnum, UserTemplate } from '../../../store/types';
import { getClientMeetingUrl } from '../../../utils/urls';

const DiscoverTemplateItem = memo(({ template }: { template: UserTemplate }) => {
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

    const handleEnterWaitingRoomTemplate = useCallback(() => {
        router.push(getClientMeetingUrl(template.id));
    }, []);

    const previewImage = (template?.previewUrls || []).find(image => image.resolution === 240);

    return (
        <CustomGrid
            className={clsx(styles.templateContent, { [styles.blurred]: showPreview })}
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
                        onClick={handleEnterWaitingRoomTemplate}
                        className={styles.button}
                        nameSpace="templates"
                        translation="buttons.startMeeting"
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

export { DiscoverTemplateItem };
